import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { SplitButton } from "primereact/splitbutton";
import client from "../../../services/restClient";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

const SingleCartItemPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);

  const [productName, setProductName] = useState([]);
  const [colour, setColour] = useState([]);
  const [size, setSize] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("cartItem")
      .get(urlParams.singleCartItemId, {
        query: {
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
            "productName",
            "colour",
            "size",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const productName = Array.isArray(res.productName)
          ? res.productName.map((elem) => ({
              _id: elem._id,
              productTitle: elem.productTitle,
            }))
          : res.productName
            ? [
                {
                  _id: res.productName._id,
                  productTitle: res.productName.productTitle,
                },
              ]
            : [];
        setProductName(productName);
        const colour = Array.isArray(res.colour)
          ? res.colour.map((elem) => ({
              _id: elem._id,
              colorName: elem.colorName,
            }))
          : res.colour
            ? [{ _id: res.colour._id, colorName: res.colour.colorName }]
            : [];
        setColour(colour);
        const size = Array.isArray(res.size)
          ? res.size.map((elem) => ({
              _id: elem._id,
              sizeValue: elem.sizeValue,
            }))
          : res.size
            ? [{ _id: res.size._id, sizeValue: res.size.sizeValue }]
            : [];
        setSize(size);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "CartItem",
          type: "error",
          message: error.message || "Failed get cartItem",
        });
      });
  }, [props, urlParams.singleCartItemId]);

  const goBack = () => {
    navigate("/app/cartItem");
  };

  const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  const copyPageLink = () => {
    const currentUrl = window.location.href;

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        props.alert({
          title: "Link Copied",
          type: "success",
          message: "Page link copied to clipboard!",
        });
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        props.alert({
          title: "Error",
          type: "error",
          message: "Failed to copy page link.",
        });
      });
  };

  const menuItems = [
    {
      label: "Copy link",
      icon: "pi pi-copy",
      command: () => copyPageLink(),
    },
    {
      label: "Help",
      icon: "pi pi-question-circle",
      command: () => toggleHelpSidebar(),
    },
  ];

  return (
    <ProjectLayout>
      <div className="col-12 flex flex-column align-items-center">
        <div className="col-12">
          <div className="flex align-items-center justify-content-between">
            <div className="flex align-items-center">
              <Button
                className="p-button-text"
                icon="pi pi-chevron-left"
                onClick={() => goBack()}
              />
              <h3 className="m-0">Cart Item</h3>
              <SplitButton
                model={menuItems.filter(
                  (m) => !(m.icon === "pi pi-trash" && items?.length === 0),
                )}
                dropdownIcon="pi pi-ellipsis-h"
                buttonClassName="hidden"
                menuButtonClassName="ml-1 p-button-text"
              />
            </div>

            {/* <p>cartItem/{urlParams.singleCartItemId}</p> */}
          </div>
          <div className="card w-full">
            <div className="grid ">
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Product Name</label>
                {productName.map((elem) => (
                  <Link key={elem._id} to={`/product/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">
                        {elem.productTitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Colour</label>
                {colour.map((elem) => (
                  <Link key={elem._id} to={`/productColor/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.colorName}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <label className="text-sm text-gray-600">Size</label>
                {size.map((elem) => (
                  <Link key={elem._id} to={`/productSize/${elem._id}`}>
                    <div>
                      {" "}
                      <p className="text-xl text-primary">{elem.sizeValue}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="col-12">&nbsp;</div>
            </div>
          </div>
        </div>

        <CommentsSection
          recordId={urlParams.singleCartItemId}
          user={props.user}
          alert={props.alert}
          serviceName="cartItem"
        />
        <div
          id="rightsidebar"
          className={classNames(
            "overlay-auto z-1 surface-overlay shadow-2 absolute right-0 w-20rem animation-duration-150 animation-ease-in-out",
            { hidden: !isHelpSidebarVisible },
          )}
          style={{ top: "60px", height: "calc(100% - 60px)" }}
        >
          <div className="flex flex-column h-full p-4">
            <span className="text-xl font-medium text-900 mb-3">Help bar</span>
            <div className="border-2 border-dashed surface-border border-round surface-section flex-auto"></div>
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleCartItemPage);
