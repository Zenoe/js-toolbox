import React from 'react';
import {Button, Spin, message} from 'antd'
import {SiteConfigTitle} from '@/components/CustomizeTitle'
import request from '@/utils/oauthFetch';
import {generateHeader, attatchBindFieldValue, requestData, checkRes, getTr069Prefix} from '@/utils/configure'
import {isString} from '@/utils/utils'

import EditableFormTable from '@/pages/configure/Table/EditableTable.tsx';
import { justDiffObject } from '@/pages/configure/util';

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
    requestData(this, mainProperty).catch(
      reject=>{
        message.warning(reject.message || reject)
      }
    )
  }

  preSubmit = (newData, recordIdx, evalFuncs, oldData, tableIndex, columns)=>{
    // const param = newData[recordIdx];
    // if(evalFuncs){
    //  // evaluate values according to evalfuncs
    // }
    let diffRes = justDiffObject(newData[recordIdx], oldData[recordIdx], false);
    const {%sitecell%} = this.props
    const { tr069KeyData } = this.state

    if(%sitecell% === undefined){
      return;
    }

    diffRes = attatchBindFieldValue(diffRes, columns, oldData[recordIdx])

    const cachedTblRecordIdxObj = {};

    Object.keys(diffRes).forEach((it)=>{
      const tr069Prefix = getTr069Prefix(tr069KeyData[tableIndex], it, recordIdx);
      this.cachedTr069KeyObj[`${tr069Prefix}.${it}`] = diffRes[it]
      cachedTblRecordIdxObj[it] = diffRes[it]
    })

    const columnMap = new Map();
    // find bounded filed values if any, push them into cachedTblRecordIdxObj
    columns.forEach(col=>{
      columnMap.set(col.key, col)
    })

    Object.keys(cachedTblRecordIdxObj).forEach(it=>{
      const boundFields = columnMap.get(it).bound
      if(boundFields && Array.isArray(boundFields)){
        boundFields.forEach(field=>{
          cachedTblRecordIdxObj[field] = newData[recordIdx][field]
        })
      }
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
      requestData(this, mainProperty).then(()=>{
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
    let instanceName = node

    if(instanceValues === null){
      // not multiple instance node
      this.setState({
        loading: true,
      }, ()=>{
        request(`${API_URL}/conf-service/inner/addInstance`,{
          method: 'POST',
          body:  {'sn': %sitecell%.serialNumber, instanceName }
        }).then(res=>this.handleResponse(res, 0)).catch(err => {
          this.setState({
            loading: false,
          })
          console.log(err);
        })
      })
    }else{
      let keyComponents = node.split('.')
      keyComponents = keyComponents.slice(0, keyComponents.length - 1)
      instanceName = `${keyComponents.join('.')}.`
      // Device.xxx.1.CellConfig..MeasObjectEUTRA.x.CellAdd.y
      // ====>
      // Device.xxx.1.CellConfig..MeasObjectEUTRA.a.CellAdd.b
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
            columns={generateHeader(headDataInfo)}
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
