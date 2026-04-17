/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';


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

const CheckoutEditDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [productName, setProductName] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

    useEffect(() => {
                                    // on mount product
                                    client
                                        .service("product")
                                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleProductId } })
                                        .then((res) => {
                                            setProductName(res.data.map((e) => { return { productTitle: `${e["productTitle"]}`,description: `${e["description"]}`,price: `${e["price"]}`,productImage: `${e["productImage"]}`, value: e._id }}));
                                        })
                                        .catch((error) => {
                                            console.debug({ error });
                                            props.alert({ title: "Product", type: "error", message: error.message || "Failed get product" });
                                        });
                                }, []);

    const onSave = async () => {
        let _data = {
            fullName: _entity?.fullName,
productName: _entity?.productName?._id,
subtotal: _entity?.subtotal,
        };

        setLoading(true);
        try {
            
        await client.service("checkout").patch(_entity._id, _data);
        const eagerResult = await client
            .service("checkout")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "productName",
                    service : "product",
                    select:["productTitle","description","price","productImage"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info checkout updated successfully" });
        props.onEditResult(eagerResult.data[0]);
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

    const productNameOptions = productName.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Checkout" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="checkout-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="fullName">FullName:</label>
                <InputText id="fullName" className="w-full mb-3 p-inputtext-sm" value={_entity?.fullName} onChange={(e) => setValByKey("fullName", e.target.value)}  />
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
                <label htmlFor="productName">Product Name:</label>
                <Dropdown id="productName" value={_entity?.productName?._id} optionLabel="name" optionValue="value" options={productNameOptions} onChange={(e) => setValByKey("productName", {_id : e.value})}  />
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
                <label htmlFor="subtotal">Subtotal:</label>
                <InputNumber id="subtotal" className="w-full mb-3 p-inputtext-sm" value={_entity?.subtotal} onChange={(e) => setValByKey("subtotal", e.value)}  useGrouping={false}/>
            </span>
            <small className="p-error">
            {!_.isEmpty(error["subtotal"]) && (
              <p className="m-0" key="error-subtotal">
                {error["subtotal"]}
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

export default connect(mapState, mapDispatch)(CheckoutEditDialogComponent);
