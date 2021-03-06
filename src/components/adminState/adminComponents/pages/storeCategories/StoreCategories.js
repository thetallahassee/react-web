import React, { Component } from 'react';
import {StoreCategoriesList} from "./StoreCategoriesList"
import {StoreCategoriesFormulary} from "./StoreCategoriesFormulary"
//import {UsersFormularyAssociation} from "./UsersFormularyAssociation"

import firebase from 'firebase';
import db from '../../../../../firebase'

export class StoreCategories extends Component{
  constructor(props){
    super(props)
    this.state={}

    this._mountParams()
  }

  componentWillUpdate(props,state){
    console.log("component will update", props, state);

  }
  componentWillReciveProps(props){
    console.log("Component will recieve props");
  }

  _mountParams=()=>{
    this.title = "Stores Categories"
    this.subtitle = "Listado categorias de tiendas"
    this.state={stateMode:"list"}
  }

  _onReturnEdit=(returned)=>{
    this.state.stateMode="edit"
    this.idToEdit = returned
  }

  _onReturnNew=()=>{
    console.log("RETURN NEW FUNC");
    this.setState({stateMode:"new"})
  }

  _onCancel=()=>{
    this.setState({stateMode:"list"})
  }

  _onSave=(object)=>{
    console.log("GUARDAR DOCUMENT", object);
    var user = firebase.auth().currentUser;
    object.userCreation = user.uid
    object.dateCreation = new Date()

    if(object.fatherCategory === undefined){
      object.isFather = true;
    }else{
      object.isFather = false;
    }

    db.collection(this.props.urlMapping).add(object)
    .then((docRef) => {
        console.log("ASOCIACION AÑADIDA OK: ", docRef.id);
        this.setState({stateMode:"list"})
    })
    .catch(function(error) {
        console.error("ERROR AL AÑADIR", error);
    });
  }

  _onUpdate=(object)=>{
    console.log("UPDATE DOCUMENT", object);
    var user = firebase.auth().currentUser;
    object.userModification = user.uid
    object.dateModification = new Date()
    db.collection(this.props.urlMapping).doc(this.idToEdit).update(object)
    .then(() => {
        console.log("UPDATED OK");
        this.setState({stateMode:"list"})
    })
    .catch(function(error) {
        console.error("ERROR AL ACTUALIZAR", error);
    });

  }

  _loadStateMode=()=>{
    switch (this.state.stateMode) {
      case "list":
          return(<StoreCategoriesList title={this.title} subtitle={this.subtitle} urlMapping={this.props.urlMapping} filter={this.props.filter} onReturnEdit={this._onReturnEdit} onReturnNew={this._onReturnNew}/>)
        break;
      case "new":
          var formulary
          //if(this.props.personalizedComponentFormulary == "association"){
          //  formulary=<UsersFormularyAssociation onCancel={this._onCancel} onSave={this._onSave} idAssociation={this.props.associationId}/>
          //}else{
            formulary=<StoreCategoriesFormulary onCancel={this._onCancel} onSave={this._onSave}/>
          //}
          return formulary
        break;
      case "edit":
          var formulary
          //if(this.props.personalizedComponentFormulary == "association"){
          //  formulary = <UsersFormularyAssociation onCancel={this._onCancel} onSave={this._onSave} idAssociation={this.props.associationId}/>
          //}else{
            formulary =< StoreCategoriesFormulary urlMapping={this.props.urlMapping} idUrl={this.idToEdit} onCancel={this._onCancel} onSave={this._onUpdate}/>
          //}
          return formulary
        break;
      default:

    }
  }

  render(){
    return(
      <div>
        {this._loadStateMode()}
      </div>
    )
  }
}
