/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";

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

const CartItemEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [productName, setProductName] = useState([]);
  const [colour, setColour] = useState([]);
  const [size, setSize] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    // on mount product
    client
      .service("product")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductId,
        },
      })
      .then((res) => {
        setProductName(
          res.data.map((e) => {
            return {
              productTitle: `${e["productTitle"]}`,
              description: `${e["description"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "Product",
          type: "error",
          message: error.message || "Failed get product",
        });
      });
  }, []);
  useEffect(() => {
    // on mount productColor
    client
      .service("productColor")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductColorId,
        },
      })
      .then((res) => {
        setColour(
          res.data.map((e) => {
            return {
              colorName: `${e["colorName"]}`,
              colorCode: `${e["colorCode"]}`,
              colorImage: `${e["colorImage"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductColor",
          type: "error",
          message: error.message || "Failed get productColor",
        });
      });
  }, []);
  useEffect(() => {
    // on mount productSize
    client
      .service("productSize")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleProductSizeId,
        },
      })
      .then((res) => {
        setSize(
          res.data.map((e) => {
            return {
              sizeValue: `${e["sizeValue"]}`,
              stockQuantity: `${e["stockQuantity"]}`,
              availableSize: `${e["availableSize"]}`,
              value: e._id,
            };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "ProductSize",
          type: "error",
          message: error.message || "Failed get productSize",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {};

    setLoading(true);
    try {
      await client.service("cartItem").patch(_entity._id, _data);
      const eagerResult = await client.service("cartItem").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "productName",
              service: "product",
              select: ["productTitle", "description"],
            },
            {
              path: "colour",
              service: "productColor",
              select: ["colorName", "colorCode", "colorImage"],
            },
            {
              path: "size",
              service: "productSize",
              select: ["sizeValue", "stockQuantity", "availableSize"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info cartItem updated successfully",
      });
      props.onEditResult(eagerResult.data[0]);
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

  const productNameOptions = productName.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const colourOptions = colour.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const sizeOptions = size.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Cart Item"
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
        role="cartItem-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="productName">Product Name:</label>
            <MultiSelect
              id="productName"
              value={_entity?.productName?.map((i) => i._id)}
              options={productNameOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("productName", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["productName"]) && (
              <p className="m-0" key="error-productName">
                {error["productName"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="colour">Colour:</label>
            <MultiSelect
              id="colour"
              value={_entity?.colour?.map((i) => i._id)}
              options={colourOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("colour", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["colour"]) && (
              <p className="m-0" key="error-colour">
                {error["colour"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="size">Size:</label>
            <MultiSelect
              id="size"
              value={_entity?.size?.map((i) => i._id)}
              options={sizeOptions}
              optionLabel="name"
              optionValue="value"
              onChange={(e) => setValByKey("size", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["size"]) && (
              <p className="m-0" key="error-size">
                {error["size"]}
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

export default connect(mapState, mapDispatch)(CartItemEditDialogComponent);
