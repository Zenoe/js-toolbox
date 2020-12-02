import React from 'react';
import {Button, Spin, message,Switch} from 'antd'
import {SiteConfigTitle} from '@/components/CustomizeTitle'
import request from '@/utils/oauthFetch';
import { checkRes } from '@/utils/configure'
import {assert, isString} from '@/utils/utils'
import {processResValues} from '@/utils/tr069parse'

import EditableFormTable from '@/pages/configure/Table/EditableTable.tsx';
import { diffObject } from '@/pages/configure/util';

import {%conftype% as mainProperty} from './data-field-prop'

class %classname% extends React.PureComponent{

  readonlyTable = false;

  cachedTr069KeyObj = {};

  constructor(props){
    super(props)
    this.state={
      loading: false,
      adding: false,
      dataSource: [],
    }
  }

  componentDidMount(){
    this.requestData().catch(
      reject=>{
        message.warning(reject.message || reject)
      }
    )
  }

  requestData = ()=>{
    return new Promise((resolve, reject)=>{
      const {%sitecell%} = this.props
      if( ! %sitecell% ){
        reject(new Error('no %sitecell%'))
      }
      const titles = mainProperty.filter((it)=>(isString(it)))
      const headDataInfos = mainProperty.filter((it)=>(!isString(it)))
      assert(titles.length === headDataInfos.length)

      let oneofNode = headDataInfos[0][0].node
      if(oneofNode.indexOf('FAPService.{i}') > 0){
        oneofNode = headDataInfos[0][0].node.replace('{i}', %sitecell%.fapServiceNum);
      }
      const params = {
        'sn': %sitecell%.serialNumber,
        'names': [ oneofNode.substring(0,oneofNode.indexOf('.{i}') + 1) ||
                   oneofNode.substring(0,oneofNode.lastIndexOf('.')) ]
      }

      this.setState({
        loading: true,
      })

      request(`${API_URL}/conf-service/inner/getValues`,{
        method: 'POST',
        body: params,
      }).then(
        res => {
          const values = res.data
          const dataSource = processResValues(values, mainProperty);
          this.setState({
            dataSource,
            loading: false,
          }, resolve())
        }
      ).catch(requestReject=>{
        this.setState({
          loading: false,
        })
        reject('请求数据失败')
        console.log(requestReject);
      })
    })
  }

  generateHeader=(headDataInfo)=>{
    const headers=[];
    headDataInfo.forEach((item)=>{
      const {text, name, type, readonly, ...rest} = item
      const headerCol = {
        title:text,
        dataIndex: name,
        key: name,
        align: 'center',
        dataType: type,
        allowNull: true,
        editable: !readonly,
        ...rest,
      }

      if(headerCol.dataType === "boolean"){
        headerCol.render=(value)=>(
          <Switch
            checked={value}
            data={item.paramStandardName}
          />)
      }

      headers.push(headerCol);
    })

    return headers;
  }

  preSubmit = (newData, recordIdx, evalFuncs, oldData, tableIndex)=>{
    // const param = newData[recordIdx];
    // if(evalFuncs){
    //  // evaluate values according to evalfuncs
    // }
    const diffRes = diffObject(oldData[recordIdx], newData[recordIdx]);
    // const dataSourceIdx = tableIndex;
    const rowkey = newData[recordIdx].key;

    const {%sitecell%} = this.props
    if(%sitecell% === undefined){
      return;
    }

    const tr069Prefix = rowkey;

    const cachedTblRecordIdxObj = {};

    Object.keys(diffRes).forEach((it)=>{
      this.cachedTr069KeyObj[`${tr069Prefix}.${it}`] = diffRes[it]
      cachedTblRecordIdxObj[it] = diffRes[it]
    })

    const {dataSource} = this.state;
    const updatedDataSource = [ ...dataSource ];
    const currentTableDatssource = dataSource[tableIndex]
    const newItem = {...currentTableDatssource[recordIdx], ...cachedTblRecordIdxObj};
    const copiedCurrentTblDataSource = [...currentTableDatssource]
    copiedCurrentTblDataSource.splice(recordIdx, 1, newItem)
    updatedDataSource.splice(tableIndex, 1, copiedCurrentTblDataSource);

    this.setState(
      {
        dataSource: updatedDataSource,
      })
  }

  onChange = ()=>{

  }

  handleResponse = (res, op)=>{
    // op: 0==> add
    // op: 1==> del
    // op: 2==> set
    // old response from server (code by chf)
    let [isSuccess, checkMsg] = checkRes(res.data);

    // new response (cody by srm)
    if(isSuccess === undefined){
      isSuccess = res.success
      checkMsg = res.message
    }

    let msg = '删除'
    if(op === 0){
      this.setState({
        adding: false,
      })
      msg = '新增'
    }
    if(op ===2 ){
      this.setState({
        loading: false,
      })
      msg = '设置'
    }

    if(isSuccess){
      this.requestData().then(()=>{
        message.success(`${msg}成功`)
        // this.cachedTblRecordIdxObj= {};
        this.cachedTr069KeyObj = {};
      }).catch((reject)=>{
        message.warning(`${msg}失败`)
        console.log(reject);
      })
    }else{
      console.log(checkMsg);
      if(isString(checkMsg)) message.warning(checkMsg)
      else message.warning('服务器返回错误')
    }
  }

  delInstance = (recordIndex, tableIndex)=>{
    const {%sitecell% } = this.props
    const {dataSource} = this.state;
    const tableData = dataSource[tableIndex]
    const { key } = tableData[recordIndex]

    request(`${API_URL}/conf-service/inner/deleteInstance`,{
      method: 'POST',
      body:  {'sn': %sitecell%.serialNumber, instanceName: `${key}.` }
    }).then(res=>this.handleResponse(res, 1)).catch(err => {
      console.log(err);
    })
  }

  addInstance = (instanceValues, node)=>{
    const {%sitecell%} = this.props
    let keyComponents = node.split('.')
    if(keyComponents.length <= 2){
      console.log('not multiple instances');
      return
    }
    keyComponents = keyComponents.slice(0, keyComponents.length - 1)
    let instanceName = `${keyComponents.join('.')}.`
    // Device.FAPService.1.CellConfig..MeasObjectEUTRA.x.CellAdd.y
    // ====>
    // Device.FAPService.1.CellConfig..MeasObjectEUTRA.a.CellAdd.b
    Object.keys(instanceValues).forEach((prop)=>{
      instanceName = instanceName.replace(new RegExp(`${prop}\\.\\d+`), `${prop}.${instanceValues[prop]}`)
    })
    this.setState({
      adding: true,
    }, ()=>{
      request(`${API_URL}/conf-service/inner/addInstance`,{
        method: 'POST',
        body:  {'sn': %sitecell%.serialNumber, instanceName }
      }).then(res=>this.handleResponse(res, 0)).catch(err => {
        this.setState({
          adding: false,
        })
        console.log(err);
      })
    })

  }

  saveAll = ()=>{
    const {%sitecell%} = this.props

    const tr069Params = {values:{
      ...this.cachedTr069KeyObj
    }}

    this.setState({
      loading: true,
    }, ()=>{
      request(`${API_URL}/conf-service/inner/setValues`,{
        method: 'POST',
        body:  {'sn': %sitecell%.serialNumber, ...tr069Params}
      }).then(res => {
        this.handleResponse(res, 2)
      }).catch(err => {
        console.log(err);
      })
    })
  }

  renderComps(){
    const {dataSource, adding} = this.state;
    const readonlyTable = false;
    const titles = mainProperty.filter((it)=>(isString(it)))
    const headDataInfos = mainProperty.filter((it)=>(!isString(it)))
    const Comps = headDataInfos.map((headDataInfo, idx)=>
      (
        <div key={idx}>
          <SiteConfigTitle name={titles[idx]} />
          <EditableFormTable
            tableIndex={idx}
            title={titles[idx]}
            handleSaveEdit={this.preSubmit}
            columns={this.generateHeader(headDataInfo)}
            readonly={readonlyTable}
            onChange={this.onChange}
            adding={adding}
            addop
            deleteAble
            handleAddInstance={this.addInstance}
            handleDelInstance={this.delInstance}
            dataSource={dataSource[idx]}
            {...this.props}
          />
        </div>
      )
    )
    return Comps;
  }

  render(){
    const {loading} = this.state;
    return(
      <Spin spinning={loading}>
        {this.renderComps()}
        <div style={{overflow: 'hidden'}}>
          <Button style={{float: 'right'}} onClick={this.saveAll}>提交修改</Button>
        </div>
      </Spin>
    )
  }
}

export default %classname%
