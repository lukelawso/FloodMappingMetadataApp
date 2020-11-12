import React, { Component } from 'react';
import axios from 'axios';
import HeatmapDataContext from '../contexts/heatmapdata';
import { ListGroup } from 'react-bootstrap';
import {Modal, Button} from 'react-bootstrap'; 

class HeatmapSearch extends Component {
    static contextType = HeatmapDataContext; 
    state = { removed: [], data: {rows: []}, list: [] };

    componentDidMount() {    
        axios.get('api/columns')
        .then((res) => {
            this.setState({data: res.data}); 
        });
    }

    removeOptions(selectElement) {
        var i, L = selectElement.options.length - 1;
        for(i = L; i >= 1; i--) {
            selectElement.remove(i);
        }
    }

    removeColumn(e) {
        var temp = this.state.removed;
        temp.push(e.target.parentNode.id.substring(11));
        this.setState({removed: temp});
    }

    categoryChanged(i) {         
        var column = document.getElementById(`searchCategory${i}`).value;
        this.removeOptions(document.getElementById(`searchTerm${i}`));
        var added = [];
        for (let j = 0; j < this.context.data.length; j++) {
            var inList = false;
            for (let k = 0; k < added.length; k++) {
                if (JSON.stringify(added[k]) === JSON.stringify(this.context.data[j][column])) {
                    inList = true;
                    break;
                }
            }
            if (this.context.data[j][column] && !inList) {
                var option = document.createElement("option");
                option.value = this.context.data[j][column];
                option.text = this.context.data[j][column];
                option.key = j;
                added.push(this.context.data[j][column]);
                console.log(this.context.data[j][column]);
                document.getElementById(`searchTerm${i}`).add(option);
            }
        }    
    }

    addColumn() {
        console.log(this.state.data.rows);
        var temp = this.state.list;
        let listIndex = temp.length;
        let columnSel = (
            <div id={`modalColumnSel${listIndex}`} className="col-lg-5 col-md-12 col-sm-12">
                <select defaultValue="Filter Column..." id={`searchCategory${listIndex}`} 
                    onChange={() => {this.categoryChanged(listIndex);}} 
                    style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%"}}>
                    <option value="Filter Column...." disabled>Filter Column....</option>
                    {this.state.data.rows.map((value, index) => 
                    ( 
                        <option key={index} value={value.column_name}>{value.column_name}</option>
                    ))}
                </select>  
            </div>
        );
        let closeButton = (
            <div id={`modalCloseButton${listIndex}`} className="col-lg-1 col-sm-12">
                <button id={`closeSearch${listIndex}`} onClick={this.removeColumn.bind(this)} type="button" className="close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
        let listFilter = (
            <div id={`modalListFiler${listIndex}`} className="col-lg-6 col-md-12 col-sm-12">
                <select defaultValue="Filter Value..." id={`searchTerm${listIndex}`} 
                    style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%"}}>                        
                    <option value="Filter Value...." disabled>Filter Value....</option>
                </select>
            </div>
        );
        let numericFilter = (
            <div id={`modalNumericFilter${listIndex}`} className="row col-lg-12 col-md-12 col-sm-12" style={{marginTop: "12px"}}>  
                <div className="col-6">
                    <label>Min:</label>                                             
                    <input id={`searchMin${listIndex}`} type="number"
                        style={{overflow: "hidden", textOverflow: "ellipsis", width: "65%", marginLeft: "10px"}} ></input>
                </div>
                <div className="col-6">
                    <label>Max:</label>                                             
                    <input id={`searchMax${listIndex}`} type="number"
                        style={{overflow: "hidden", textOverflow: "ellipsis", width: "65%", marginLeft: "10px"}} ></input>
                </div>
            </div>
        );
        temp.push(
            <ListGroup.Item key={listIndex}>
                <div className="row">
                    {columnSel}
                    {listFilter}
                    {numericFilter}
                    {closeButton}
                </div>
            </ListGroup.Item>);
        this.setState({list: temp});
    
        
    }
    
    render() {
        var temp = [];
        for (let i = 0; i < this.state.list.length; i++) {
            if (this.state.removed.indexOf(i.toString()) === -1 ) {
                temp.push(this.state.list[i]);
            }
        }
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Advanced Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div>
                    <ListGroup>
                        {temp}
                    </ListGroup>                    
                </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.addColumn.bind(this)}
                        className="mr-auto">Add Row</Button>
                    <Button variant="secondary" onClick={this.props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.props.handleSearchClose}>
                        Search
                    </Button>
                </Modal.Footer>
            </Modal>
            
        )
    }
}

export default HeatmapSearch;