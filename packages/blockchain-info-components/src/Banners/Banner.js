import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { transparentize } from 'polished'

import { Icon } from '../Icons'
import { Text } from '../Text'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${props => transparentize(0.9, (props.theme[props.color]))};
  border: 1px solid ${props => transparentize(0.8, (props.theme[props.color]))};
  border-radius: 4px;
  padding: 5px 10px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  width: ${props => props.width ? props.width : `initial`};

  & > :first-child { margin-right: 8px; }
`

const BannerContent = styled(Text)`
  display: flex;
  flex-direction: row;
  & a:last-of-type { margin-left: 5px; }
`

const selectStyle = type => {
  switch (type) {
    case 'success': return { color: 'success', uppercase: false, icon: 'checkmark-in-circle' }
    case 'warning': return { color: 'error', uppercase: true, icon: 'alert' }
    case 'alert': return { color: 'brand-secondary', uppercase: false, icon: 'bell' }
    case 'caution': return { color: 'brand-yellow', uppercase: false, icon: 'alert' }
    default: return { color: 'brand-secondary', uppercase: false, icon: null }
  }
}

const Banner = props => {
  const { type, children, width } = props
  const style = selectStyle(type)
  const { color, uppercase, icon } = style

  return (
    <Container color={color} width={width}>
      { icon && <Icon name={icon} size='12px' weight={700} color={color} /> }
      <BannerContent size='12px' weight={400} color={color} uppercase={uppercase}>
        { children }
      </BannerContent>
    </Container>
  )
}

Banner.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'alert', 'caution']),
  children: PropTypes.node.isRequired,
  width: PropTypes.string
}

export default Banner
