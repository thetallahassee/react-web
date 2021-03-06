import React, { Component } from 'react';

export class ProfileContent extends Component{
  constructor(props){
    super(props)

    this.state = {}
    console.log("PROFILE INFO COMPONENT", props);
    if(this.props.userParams.userDomain.logo[0] === undefined){
      this.profileImage = ""
    }else{
      this.profileImage=this.props.userParams.userDomain.logo[0].url
    }
  }

  render(){
    return(
      <div>
        <figure className="image is-128x128">
          <img className="is-rounded" src={this.profileImage}/>
        </figure>
        <div className="align-left">
          <h3 className="text-box-profile">{this.props.userParams.name}</h3>
          <p className="sub.title text-box-profile">{this.props.userParams.code}</p>
          <p className="subtitle is-6 text-box-profile">{this.props.userParams.email}</p>
          <p className="subtitle is-6 text-box-profile">{this.props.userParams.userDomain.name}</p>
          <p className="subtitle is-6 text-box-profile">{this.props.userParams.userDomain.address.street}, {this.props.userParams.userDomain.address.number}</p>
        </div>
      </div>
    )
  }
}
