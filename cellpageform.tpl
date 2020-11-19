import React from 'react';
import {Spin, message} from 'antd'
import request from '@/utils/oauthFetch';
import { checkRes } from '@/utils/configure'
import {assert, isString} from '@/utils/utils'
import {processSimpleTr069Values} from '@/utils/tr069parse'

import SimpleForm from '@/components/simpleform';

import {%conftype% as mainProperty} from './data-field-prop'

class %classname% extends React.PureComponent{

  commonNodePrefix

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
        'names': [ oneofNode.substring(0,oneofNode.lastIndexOf('.')) ]
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
          const [commonNodePrefix, dataSource] = processSimpleTr069Values(values, mainProperty);
          this.commonNodePrefix = commonNodePrefix.replace('{i}', selectedCell.fapServiceNum);
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

  handleSubmit = (params, form)=>{
    const {dataSource} = this.state;
    const {selectedCell} = this.props

    const values2Send = {}
    Object.keys(params).forEach((it)=>{
      values2Send[`${this.commonNodePrefix}.${it}`] = params[it];
    })
    const tr069Params = {values:values2Send}

    this.setState({
      loading: true,
    })
    request(`${API_URL}/conf-service/inner/setValues`,{
      method: 'POST',
      body: [ {'sn': selectedCell.serialNumber, ...tr069Params} ]
    }).then(res => {
      const [isSuccess, checkMsg] = checkRes(res.data);
      if(isSuccess){
        const newItem = {...dataSource[0], ...params};
        const copiedDataSource = [...dataSource]
        copiedDataSource.splice(0, 1, newItem)

        this.setState(
          {
            dataSource: copiedDataSource,
            loading: false,
          },()=>{
            message.success('配置成功')
          })
      }else{
        this.resetState(form)
        message.warning(checkMsg)
      }
    }).catch(err => {
      console.log(err);
      this.resetState()
    })
  }

  renderComps(){
    const {dataSource} = this.state;
    const titles = mainProperty.filter((it)=>(isString(it)))
    const headDataInfos = mainProperty.filter((it)=>(!isString(it)))
    const Comps = headDataInfos.map((headDataInfo, idx)=>
      (
        <div key={idx}>
          <SimpleForm
            titleName={titles[idx]}
            formMetaData={headDataInfo}
            dataSource={dataSource}
            handleSaveEdit={this.handleSubmit}
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
      </Spin>
    )
  }
}

export default %classname%
