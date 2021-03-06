import React from 'react'
import PropTypes from 'prop-types'

import { Link, Icon } from 'blockchain-info-components'

const Refresh = (props) => {
  const { handleRefresh } = props

  return (
    <Link size='14px' weight={300} color='white' uppercase onClick={handleRefresh}>
      <Icon name='refresh-filled' color='white'/>
    </Link>
  )
}

Refresh.propTypes = {
  handleRefresh: PropTypes.func.isRequired
}

export default Refresh
