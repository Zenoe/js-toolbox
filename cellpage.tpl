import TableContainer from '@/pages/site/site-config/component/platform-config/tableContainer'

import React from 'react';
import {SiteConfigTitle} from '@/components/CustomizeTitle'
import fetchData from '@/hoc/withfetchdata';
import {%conftype% as mainProperty} from '../data-field-prop'


const %classname% = ({selectedCell})=>{
  const configType='%conftype%'
  const title='%title%'
  const readOnlyForm = false;
  let serialNumber = '';
  let fapServiceNum = '';
  if(selectedCell ){
    ( { serialNumber } = selectedCell );
    ( { fapServiceNum } = selectedCell );
  }

  const params={"pageSize":10,"pageNo":1,"list":[{serialNumber, fapServiceNum}]}
  const withConfData = fetchData(title,
                                     'conf-service',
                                     {url: `${configType}/getConfigBatch`,
                                      params},
                                    {
                                      url: `${configType}/setConfigBatch`,
                                      params:{
                                        serialNumber,
                                        fapServiceNum,
                                      }
                                    })

  const Comp = withConfData(TableContainer(mainProperty, null, readOnlyForm, title));
  return(
    <React.Fragment>
      <SiteConfigTitle name={title} />
      <div style={{'padding':'10px'}}>
        <Comp />
      </div>
    </React.Fragment>
  )
}

export default %classname%
