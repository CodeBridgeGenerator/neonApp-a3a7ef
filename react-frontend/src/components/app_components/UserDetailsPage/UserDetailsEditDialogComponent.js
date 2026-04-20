/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

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

const UserDetailsEditDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [email, setEmail] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    //on mount customerEmail
    client
      .service("customerEmail")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCustomerEmailId,
        },
      })
      .then((res) => {
        setEmail(
          res.data.map((e) => {
            return { name: e["email"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.debug({ error });
        props.alert({
          title: "CustomerEmail",
          type: "error",
          message: error.message || "Failed get customerEmail",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      fullName: _entity?.fullName,
      phoneNumber: _entity?.phoneNumber,
      email: _entity?.email?._id,
      passwordHash: _entity?.passwordHash,
    };

    setLoading(true);
    try {
      await client.service("userDetails").patch(_entity._id, _data);
      const eagerResult = await client.service("userDetails").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "email",
              service: "customerEmail",
              select: ["email"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info userDetails updated successfully",
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

  const emailOptions = email.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit User Details"
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
        role="userDetails-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="fullName">Full Name:</label>
            <InputText
              id="fullName"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.fullName}
              onChange={(e) => setValByKey("fullName", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["fullName"]) && (
              <p className="m-0" key="error-fullName">
                {error["fullName"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <InputText
              id="phoneNumber"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.phoneNumber}
              onChange={(e) => setValByKey("phoneNumber", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["phoneNumber"]) && (
              <p className="m-0" key="error-phoneNumber">
                {error["phoneNumber"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="email">Email :</label>
            <Dropdown
              id="email"
              value={_entity?.email?._id}
              optionLabel="name"
              optionValue="value"
              options={emailOptions}
              onChange={(e) => setValByKey("email", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["email"]) && (
              <p className="m-0" key="error-email">
                {error["email"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="passwordHash">Password Hash:</label>
            <InputText
              id="passwordHash"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.passwordHash}
              onChange={(e) => setValByKey("passwordHash", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["passwordHash"]) && (
              <p className="m-0" key="error-passwordHash">
                {error["passwordHash"]}
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

export default connect(mapState, mapDispatch)(UserDetailsEditDialogComponent);
