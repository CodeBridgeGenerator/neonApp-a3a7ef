/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
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
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const CategoryEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  const onSave = async () => {
    let _data = {
      brandName: _entity?.brandName,
      gender: _entity?.gender,
      isSale: _entity?.isSale,
      productPrice: _entity?.productPrice,
      productImage: _entity?.productImage,
      productSearch: _entity?.productSearch,
      sortBy: _entity?.sortBy,
      filterBy: _entity?.filterBy,
    };

    setLoading(true);
    try {
      const result = await client.service("category").patch(_entity._id, _data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info category updated successfully",
      });
      props.onEditResult(result);
    } catch (error) {
      console.debug("error", error);
      setError(
        getSchemaValidationErrorsStrings(error) || "Failed to update info",
      );
      props.alert({
        type: "error",
        title: "Edit info",
        message: "Failed to update info",
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
      header="Edit Category"
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
        role="category-edit-dialog-component"
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
            {!_.isEmpty(error["brandName"]) && (
              <p className="m-0" key="error-brandName">
                {error["brandName"]}
              </p>
            )}
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
            {!_.isEmpty(error["gender"]) && (
              <p className="m-0" key="error-gender">
                {error["gender"]}
              </p>
            )}
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
            {!_.isEmpty(error["isSale"]) && (
              <p className="m-0" key="error-isSale">
                {error["isSale"]}
              </p>
            )}
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
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productPrice"]) && (
              <p className="m-0" key="error-productPrice">
                {error["productPrice"]}
              </p>
            )}
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
            {!_.isEmpty(error["productImage"]) && (
              <p className="m-0" key="error-productImage">
                {error["productImage"]}
              </p>
            )}
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
            {!_.isEmpty(error["productSearch"]) && (
              <p className="m-0" key="error-productSearch">
                {error["productSearch"]}
              </p>
            )}
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
            {!_.isEmpty(error["sortBy"]) && (
              <p className="m-0" key="error-sortBy">
                {error["sortBy"]}
              </p>
            )}
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
            {!_.isEmpty(error["filterBy"]) && (
              <p className="m-0" key="error-filterBy">
                {error["filterBy"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12">&nbsp;</div>
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

export default connect(mapState, mapDispatch)(CategoryEditDialogComponent);
