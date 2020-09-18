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
      const {selectedCell} = this.props
      if( ! selectedCell ){
        reject(new Error('no selectedCell'))
      }
      const titles = mainProperty.filter((it)=>(isString(it)))
      const headDataInfos = mainProperty.filter((it)=>(!isString(it)))
      assert(titles.length === headDataInfos.length)

      const oneofNode = headDataInfos[0][0].node.replace('{i}', selectedCell.fapServiceNum);
      const params = {
        'sn': selectedCell.serialNumber,
        'names': [ oneofNode.substring(0,oneofNode.indexOf('.{i}')) ||
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
          const { values } = res.data.data
          // console.log(transformParams()(values, keyMapObj, Object.keys(values)));
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
        reject (requestReject)
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

    const {selectedCell} = this.props
    if(selectedCell === undefined){
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

  addInstance = (instanceName)=>{
    const {selectedCell} = this.props

    console.log('addInstance:', instanceName);
    request(`${API_URL}/conf-service/inner/addInstance`,{
      method: 'POST',
      body: [ {'sn': selectedCell.serialNumber, instanceName } ]
    }).then(res => {
      const [isSuccess, checkMsg] = checkRes(res.data);
      if(isSuccess){
        this.requestData().then(()=>{
          message.success('配置成功')
          // this.cachedTblRecordIdxObj= {};
          this.cachedTr069KeyObj = {};
        }).catch((reject)=>{
          message.warning(reject.message || reject)
          console.log(reject);
        })
      }else{
        message.warning(checkMsg)
      }
    }).catch(err => {
      console.log(err);
    })
  }

  saveAll = ()=>{
    const {selectedCell} = this.props

    const tr069Params = {values:{
      ...this.cachedTr069KeyObj
    }}

    request(`${API_URL}/conf-service/inner/setValues`,{
      method: 'POST',
      body: [ {'sn': selectedCell.serialNumber, ...tr069Params} ]
    }).then(res => {
      const [isSuccess, checkMsg] = checkRes(res.data);
      if(isSuccess){
        this.requestData().then(()=>{
          message.success('配置成功')
          // this.cachedTblRecordIdxObj= {};
          this.cachedTr069KeyObj = {};
        }).catch((reject)=>{
          message.warning(reject.message || reject)
        })
      }else{
        message.warning(checkMsg)
      }
    }).catch(err => {
      console.log(err);
    })
  }

  renderComps(){
    const {dataSource} = this.state;
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
            addop
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
