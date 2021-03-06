import React, { Component } from 'react';
import firebase from 'firebase';
import db from '../../../firebase'

/*const dataOrPromise = new Promise(
  (resolve, reject) => { // fat arrow
    resolve("HOLAS");
    //reject(reason);

  }
);*/

export class Select extends Component{
  constructor(props){
    super(props)
    this.isRequired = this.props.required
    this.errorState = false

    this.arrRet = []
    this.objResp = []
    this.state = {loading:true, objsToSelect:[]}
    /*if(this.props.value != null){
      this.value = this.props.value
      var retErr
      if(this.isRequired && (this.value==null || this.value=="")){
        retErr = true
      }else{
        retErr = false
      }
      this.props.onResults(this.props.resourceName, this.value, retErr)
    }else{
      this.value = 0
      this.props.onResults(this.props.resourceName, null, true)
    }*/

    if(this.props.value != null){
      this.value = this.props.value
      var retErr
      if(this.isRequired && (this.value==null || this.value=="")){
        retErr = true
      }else{
        retErr = false
      }
      this.props.onResults(this.props.resourceName, this.value, retErr)
    }else{
      this.value = 0
      //this.props.onResults(this.props.resourceName, null, this.isRequired)
    }

    this._cargarResultadosCombo()

  }

  _cargarResultadosCombo=()=>{
    console.log("CARGA RESULTADOS COMBO",this.props);
      var collection = db.collection(this.props.url);
      var query;
      if(this.props.filter === undefined && this.props.filterOR === undefined){
        this._consulta(collection)
      }else{//filter AND
        var filter = this.props.filter;

        /*if(Array.isArray(filter)){
          query = collection
          filter.forEach((val)=>{
            console.log("VALOR VAL", val[0], val[1], val[2]);
            query = query.where(val[0], val[1],val[2])
          })
        }else{*/
          query = collection.where(filter[0], filter[1],filter[2]);
        //}
        this._consulta(query)
      }
  }



  /*_getDataOr=()=>{
    dataOrPromise
    .then(()=>{
      console.log("PROMISE OK");
    })
    .catch(()=>{
      console.log("PROMISE ERROR");
    })
  }*/



  _consulta=(coll)=>{
    coll.get().then((querySnapshot) => {
      //var arrRet = []
      //var objResp = []
        querySnapshot.forEach((doc) =>{
          let resp = doc.data()
          let obj = {}
          //let str="element_"+i
          obj.id = doc.id
          obj.name=  resp[this.props.showFields[0]] +"-"+ resp[this.props.showFields[1]]

          if(this.props.value != null && this.props.value.id === obj.id){
            this.value = obj.id
            this.arrRet.push(<option value={doc.id} selected>{obj.name}</option>)
          }else{
            this.arrRet.push(<option value={doc.id}>{obj.name}</option>)
          }

          resp.id = obj.id
          this.objResp.push(resp)
        });
        this.setState({
          camposCombo:this.arrRet,
          objsToSelect:this.objResp,
          loading:false
        })
        console.log("RETORNA ARR",this.state);
        //return arrRet
    });
  }

  _mountSelectLoading=()=>{
    return(
      <div className="control select-size">
        <div className="select is-loading select-size">
          <select disabled>
            <option>-Seleccione Opción-</option>
          </select>
        </div>
      </div>
    )
  }

  _mountSelectOptions=()=>{
    return(
      <div className="select select-size">
        <select id="valoresList" className="select-size" onChange={this._changeOnSelect}>
          <option value="0">-Seleccione Opción-</option>
          {this.state.camposCombo}
        </select>
      </div>
    )
  }

  _changeOnSelect=(e)=>{
    console.log("CAMBIO EN SELECT--1", this.state.camposCombo);
    console.log("CAMBIO EN SELECT", e.target.value);
    var value
    this.state.objsToSelect.forEach((elem)=>{
      if(e.target.value === 0){
        value=null
      }
      else if(elem.id === e.target.value){
        value = elem
      }
    })

    this.value = e.target.value

    if(this.isRequired && this.value === 0){
      console.log("ERROR SELECT OBLIGATORIO!!!!!!");
      this.errorState = true
    }else{
      console.log("SELECT CONTINUE!!!!!!");
      this.errorState = false
    }

    this.props.onResults(this.props.resourceName, value, this.errorState)
  }

  render(){
    var selectionState

    if(this.state.loading){
      console.log("SELECT LOADING!!!!!!");
      selectionState = this._mountSelectLoading()
    }else if(this.isRequired && this.value === 0){
      console.log("SELECT ERROR!!!!!!");
      this.errorState = true
      selectionState = <div className="select select-size is-danger ">
                          <select id="valoresList" className="select-size" onChange={this._changeOnSelect}>
                            <option value="0">-Seleccione Opción-</option>
                            {this.state.camposCombo}
                          </select>
                        </div>
    }else{
      console.log("SELECT WAI!!!!!!");
      selectionState = this._mountSelectOptions()
    }

    return(
      <div className="padding-input select-align">
      <ul className="list-without-marks">
        <li className="title-input">
          <p>{this.props.inputTitle}</p>
        </li>
        <li>
        {selectionState}
        </li>
      </ul>

      </div>
    )
  }

  shouldComponentUpdate(nextProps, nextState){
    console.log("SHOUD COMP UPDATE", nextProps,nextState)
    //this.state.camposCombo = nextState.camposCombo
    //this.state.loading = nextState.loading
    //this.state.objsToSelect = nextState.objsToSelect

    /*this.setState({
      camposCombo:nextState.camposCombo,
      loading:nextState.loading,
      objsToSelect:nextState.objsToSelect
    })*/
    /*this.idComp = nextProps.id
    this.isRequired = nextProps.required
    this.inputTitle = nextProps.inputTitle
    this.errorState = false
    if(nextProps.value == undefined){
      this.value = ""
    }else{
      this.value = nextProps.value
    }*/


    return true
  }
}



/*<div className="select">
  <select id="valoresList">
    <option value="0">-Seleccione Opción-</option>
    <option value="1">-Option 1-</option>
    <option value="2">-Option 2-</option>
  </select>
</div>*/
