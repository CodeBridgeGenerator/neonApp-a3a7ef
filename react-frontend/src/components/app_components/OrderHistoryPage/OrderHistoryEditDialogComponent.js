/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Calendar } from "primereact/calendar";
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';


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

const OrderHistoryEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

    

    const onSave = async () => {
        let _data = {
            orderNumber: _entity?.orderNumber,
orderDate: _entity?.orderDate,
totalAmount: _entity?.totalAmount,
orderStatus: _entity?.orderStatus,
canReorder: _entity?.canReorder,
variantLabel: _entity?.variantLabel,
favourite: _entity?.favourite,
        };

        setLoading(true);
        try {
            
        const result = await client.service("orderHistory").patch(_entity._id, _data);
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info orderHistory updated successfully" });
        props.onEditResult(result);
        
        } catch (error) {
            console.debug("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    

    return (
        <Dialog header="Edit Order History" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="orderHistory-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="orderNumber">Order Number:</label>
                <InputText id="orderNumber" className="w-full mb-3 p-inputtext-sm" value={_entity?.orderNumber} onChange={(e) => setValByKey("orderNumber", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["orderNumber"]) && (
              <p className="m-0" key="error-orderNumber">
                {error["orderNumber"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="orderDate">Order Date:</label>
                <Calendar id="orderDate"  value={_entity?.orderDate ? new Date(_entity?.orderDate) : null} dateFormat="dd/mm/yy" onChange={ (e) => setValByKey("orderDate", new Date(e.value))} showIcon showButtonBar  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["orderDate"]) && (
              <p className="m-0" key="error-orderDate">
                {error["orderDate"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="totalAmount">Total Amount:</label>
                <InputNumber id="totalAmount" className="w-full mb-3" mode="currency" currency="MYR" locale="en-US" value={_entity?.totalAmount} onValueChange={(e) => setValByKey("totalAmount", e.value)} useGrouping={false}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["totalAmount"]) && (
              <p className="m-0" key="error-totalAmount">
                {error["totalAmount"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="orderStatus">Order Status:</label>
                <InputText id="orderStatus" className="w-full mb-3 p-inputtext-sm" value={_entity?.orderStatus} onChange={(e) => setValByKey("orderStatus", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["orderStatus"]) && (
              <p className="m-0" key="error-orderStatus">
                {error["orderStatus"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field flex">
            <span className="align-items-center">
                <label htmlFor="canReorder">Can Reorder:</label>
                <Checkbox id="canReorder" className="ml-3" checked={_entity?.canReorder} onChange={(e) => setValByKey("canReorder", e.checked)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["canReorder"]) && (
              <p className="m-0" key="error-canReorder">
                {error["canReorder"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="variantLabel">Variant Label:</label>
                <InputText id="variantLabel" className="w-full mb-3 p-inputtext-sm" value={_entity?.variantLabel} onChange={(e) => setValByKey("variantLabel", e.target.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["variantLabel"]) && (
              <p className="m-0" key="error-variantLabel">
                {error["variantLabel"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field flex">
            <span className="align-items-center">
                <label htmlFor="favourite">Favourite:</label>
                <Checkbox id="favourite" className="ml-3" checked={_entity?.favourite} onChange={(e) => setValByKey("favourite", e.checked)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["favourite"]) && (
              <p className="m-0" key="error-favourite">
                {error["favourite"]}
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

export default connect(mapState, mapDispatch)(OrderHistoryEditDialogComponent);
