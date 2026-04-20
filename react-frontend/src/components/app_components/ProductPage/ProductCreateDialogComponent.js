import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";

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

const ProductCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [price, setPrice] = useState([]);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization({ ...props?.entity, ...init }, [price], setError);
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
      productTitle: _entity?.productTitle,
      description: _entity?.description,
      price: _entity?.price,
      productImage: _entity?.productImage,
      smallImage: _entity?.smallImage,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("product").create(_data);
      const eagerResult = await client.service("product").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "price",
              service: "productPrice",
              select: [
                "productName",
                "basePrice",
                "currency",
                "discountedPrice",
                "taxPercentage",
              ],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Product updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.debug("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Product",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount productPrice
    client
      .service("productPrice")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductPriceId,
        },
      })
      .then((res) => {
        setPrice(
          res.data.map((e) => {
            return {
              productName: `${e["productName"]}`,
              basePrice: `${e["basePrice"]}`,
              currency: `${e["currency"]}`,
              discountedPrice: `${e["discountedPrice"]}`,
              taxPercentage: `${e["taxPercentage"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductPrice",
          type: "error",
          message: error.message || "Failed get productPrice",
        });
      });
  }, []);

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

  const priceOptions = price.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Product"
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
        role="product-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productTitle">Product Title:</label>
            <InputText
              id="productTitle"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.productTitle}
              onChange={(e) => setValByKey("productTitle", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productTitle"]) ? (
              <p className="m-0" key="error-productTitle">
                {error["productTitle"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="description">Description:</label>
            <InputTextarea
              id="description"
              rows={5}
              cols={30}
              value={_entity?.description}
              onChange={(e) => setValByKey("description", e.target.value)}
              autoResize
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["description"]) ? (
              <p className="m-0" key="error-description">
                {error["description"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="price">Price:</label>
            <MultiSelect
              id="price"
              value={_entity?.price}
              options={priceOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("price", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["price"]) ? (
              <p className="m-0" key="error-price">
                {error["price"]}
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
            <label htmlFor="smallImage">Small Image:</label>
            <InputText
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.smallImage}
              onChange={(e) => setValByKey("smallImage", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["smallImage"]) ? (
              <p className="m-0" key="error-smallImage">
                {error["smallImage"]}
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

export default connect(mapState, mapDispatch)(ProductCreateDialogComponent);
