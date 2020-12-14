import React, { Component } from "react";
import Axios from "axios";
import "./style.css";

const url = "https://fir-dynamiclinks-e43dd.web.app/practical-api.json";
let MyServices = [];
let MySubServices = [];

class Home extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      TotalServicePriceArray: [],
    };
  }

  // Return service_selected is not null
  isValid = (data) => {
    return data.service_selected !== null;
  };

  // Return service_selected is null

  isInValid = (data) => {
    return data.service_selected === null;
  };

  //Render SubServiceList

  renderSubServiceList = (ServiceData) => {
    return ServiceData.map((sub_service) => {
      let price = parseInt(sub_service.price);
      return (
        <div className="card myCard" key={sub_service.id}>
          <div className="card-body serviceCard">
            <img src={sub_service.image} alt="ServiceImg" />
            <div>
              <h5 className="card-title subServiceHead">
                {sub_service.name}
                <span>₹ {price}</span>
              </h5>
              <p className="card-text">{sub_service.description}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  //Filter out all Non_Null_Sub_Services

  FilterNonNullSubService = (data) => {
    return data.service_selected !== null;
  };

  //Filter out all Main_Services

  FilterMainService = (data) => {
    return (
      data.purchased_office_template.purchased_office_services.filter(
        this.FilterNonNullSubService
      ).length > 0
    );
  };

  //Render PurchaseList

  renderPurchaseList = (list) => {
    if (Object.keys(list).length > 0) {
      MyServices = list.data.purchased_services.filter(this.FilterMainService);
      let subServiceArray = [];
      return MyServices.map((service) => {
        subServiceArray = service.purchased_office_template.purchased_office_services.filter(
          this.isValid
        );
        return (
          <div className="row" key={service.id}>
            <h6>{service.name} :</h6>

            {this.renderSubServiceList(subServiceArray)}
          </div>
        );
      });
    }
  };

  //Filter out all _Null_Sub_Services

  FilterNullSubService = (data) => {
    return data.service_selected === null;
  };

  //Filter all Additional_Services

  FilterAdditionalService = (data) => {
    return (
      data.purchased_office_template.purchased_office_services.filter(
        this.FilterNullSubService
      ).length > 0
    );
  };

  //Render Additional_List

  renderAdditionalList = (list) => {
    if (Object.keys(list).length > 0) {
      MyServices = list.data.purchased_services.filter(
        this.FilterAdditionalService
      );
      let subServiceArray = [];
      return MyServices.map((service) => {
        subServiceArray = service.purchased_office_template.purchased_office_services.filter(
          this.isInValid
        );
        return (
          <div className="row" key={service.id}>
            <h6>{service.name} :</h6>
            {this.renderSubServiceList(subServiceArray)}
          </div>
        );
      });
    } else {
      <p>Please wait we are fetching your details</p>;
    }
  };

  //Render All_Services_in_Total_Section

  renderAllServices = (service) => {
    if (Object.keys(service).length > 0) {
      MySubServices = service.data.purchased_services.filter(
        this.FilterMainService
      );
      let subServiceArray = [];
      return MySubServices.map((services) => {
        subServiceArray = services.purchased_office_template.purchased_office_services.filter(
          this.isValid
        );
        return (
          <ul className="list-group list-group-flush">
            {this.renderTotalSubServiceList(subServiceArray)}
          </ul>
        );
      });
    } else {
      <p>Calculating result</p>;
    }
  };

  //Render All_Sub_Services_in_Total_Section

  renderTotalSubServiceList = (ServiceData) => {
    return ServiceData.map((sub_service) => {
      let price = parseInt(sub_service.price);
      this.state.TotalServicePriceArray.push(price);
      return (
        <li className="list-group-item totalList" key={sub_service.id}>
          {sub_service.name}
          <span>₹ {price}</span>
        </li>
      );
    });
  };

  //API Call to fetch Data

  componentDidMount() {
    Axios.get(url).then((res) => {
      this.setState({ data: res.data });
      console.log(res.data);
    });
  }

  //Main Component Render
  render() {
    return (
      <React.Fragment>
        <div className="container">
          <h1 className="heading">PURCHASED SERVICES</h1>
          <p>List of all Purchased Services</p>
          <div className="container">
            {this.renderPurchaseList(this.state.data)}
          </div>
        </div>
        <div className="container">
          <div className="card totalCard">
            {this.renderAllServices(this.state.data)}
            <div className="card-footer totalList">
              Total Costing
              <span>
                ₹
                {this.state.TotalServicePriceArray.reduce((a, b) => {
                  return a + b;
                }, 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="container">
          <h1 className="heading">ADDITIONAL SERVICES</h1>
          <p>List of all Additional Services</p>

          <div className="container">
            {this.renderAdditionalList(this.state.data)}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
