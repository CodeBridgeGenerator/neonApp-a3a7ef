import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
const filterByArray = [];
const filterByOptions = filterByArray.map((x) => ({ name: x, value: x }));

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg[key] = element.message;
      }
    }
  }
  return errMsg.length
    ? errMsg
    : errorObj.message
      ? { error: errorObj.message }
      : {};
};

const CategoryCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    let init = { isSale: false };
    if (!_.isEmpty(props?.entity)) {
      init = initilization({ ...props?.entity, ...init }, [], setError);
    }
    set_entity({ ...init });
    setError({});
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      brandName: _entity?.brandName,
      gender: _entity?.gender,
      isSale: _entity?.isSale || false,
      productPrice: _entity?.productPrice,
      productImage: _entity?.productImage,
      productSearch: _entity?.productSearch,
      sortBy: _entity?.sortBy,
      filterBy: _entity?.filterBy,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("category").create(_data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Category created successfully",
      });
      props.onCreateResult(result);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Category",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button
        label="save"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
      />
      <Button
        label="close"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };

  return (
    <Dialog
      header="Create Category"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max scalein animation-ease-in-out animation-duration-1000"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="category-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="brandName">Brand Name:</label>
            <InputText
              id="brandName"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.brandName}
              onChange={(e) => setValByKey("brandName", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["brandName"]) ? (
              <p className="m-0" key="error-brandName">
                {error["brandName"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="gender">Gender:</label>
            <InputText
              id="gender"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.gender}
              onChange={(e) => setValByKey("gender", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["gender"]) ? (
              <p className="m-0" key="error-gender">
                {error["gender"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field flex">
          <span className="align-items-center">
            <label htmlFor="isSale">is Sale:</label>
            <Checkbox
              id="isSale"
              className="ml-3"
              checked={_entity?.isSale}
              onChange={(e) => setValByKey("isSale", e.checked)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["isSale"]) ? (
              <p className="m-0" key="error-isSale">
                {error["isSale"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productPrice">Product Price:</label>
            <InputNumber
              id="productPrice"
              className="w-full mb-3"
              mode="currency"
              currency="MYR"
              locale="en-US"
              value={_entity?.productPrice}
              onValueChange={(e) => setValByKey("productPrice", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productPrice"]) ? (
              <p className="m-0" key="error-productPrice">
                {error["productPrice"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productImage">Product Image:</label>
            <InputText
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.productImage}
              onChange={(e) => setValByKey("productImage", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productImage"]) ? (
              <p className="m-0" key="error-productImage">
                {error["productImage"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productSearch">Product Search:</label>
            <InputText
              id="productSearch"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.productSearch}
              onChange={(e) => setValByKey("productSearch", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productSearch"]) ? (
              <p className="m-0" key="error-productSearch">
                {error["productSearch"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="sortBy">Sort By:</label>
            <InputText
              id="sortBy"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.sortBy}
              onChange={(e) => setValByKey("sortBy", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["sortBy"]) ? (
              <p className="m-0" key="error-sortBy">
                {error["sortBy"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="filterBy">Filter By:</label>
            <Dropdown
              id="filterBy"
              value={_entity?.filterBy}
              options={filterByOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("filterBy", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["filterBy"]) ? (
              <p className="m-0" key="error-filterBy">
                {error["filterBy"]}
              </p>
            ) : null}
          </small>
        </div>
        <small className="p-error">
          {Array.isArray(Object.keys(error))
            ? Object.keys(error).map((e, i) => (
                <p className="m-0" key={i}>
                  {e}: {error[e]}
                </p>
              ))
            : error}
        </small>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(CategoryCreateDialogComponent);
