import React, { Component } from 'react'
//import { CloseIcon } from '../../Icons'
//import { CloseIconAbsolute, Label } from './Common'

export default class CloseButton extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    this.props.onClick(e, this)
  }

  render () {
    return (
      <span className='CloseButton' onClick={this.onClick}>
        {this.props.label}
        <div>CloseIconAbsolute replaces this div</div>
      </span>
    )
  }
}

const t = React.PropTypes

CloseButton.propTypes = {
 onClick: t.func.isRequired,
 label: t.string.isRequired
}