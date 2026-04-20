import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import _ from "lodash";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { StyleClass } from "primereact/styleclass";
import { Ripple } from "primereact/ripple";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { Menu } from "primereact/menu";
import { MultiSelect } from "primereact/multiselect";
import { ToggleButton } from "primereact/togglebutton";
import client from "../../../services/restClient";
import entityCreate from "../../../utils/entity";
import DownloadCSV from "../../../utils/DownloadCSV";
import AreYouSureDialog from "../../common/AreYouSureDialog";
import CategoryEditDialogComponent from "./CategoryEditDialogComponent";
import CategoryCreateDialogComponent from "./CategoryCreateDialogComponent";
import CategoryFakerDialogComponent from "./CategoryFakerDialogComponent";
import CategorySeederDialogComponent from "./CategorySeederDialogComponent";

const CategoryPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAreYouSureDialog, setShowAreYouSureDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRecord, setRecord] = useState({});
  const [showFakerDialog, setShowFakerDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showSeederDialog, setShowSeederDialog] = useState(false);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilterFields, setSelectedFilterFields] = useState([]);
  const [selectedHideFields, setSelectedHideFields] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [searchDialog, setSearchDialog] = useState(false);
  const [triggerDownload, setTriggerDownload] = useState(false);
  const urlParams = useParams();
  const filename = "category";
  const [isHelpSidebarVisible, setHelpSidebarVisible] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [selectedDelete, setSelectedDelete] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [permissions, setPermissions] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [paginatorRecordsNo, setPaginatorRecordsNo] = useState(10);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const btnRef1 = useRef(null);
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);
  const btnRef5 = useRef(null);
  const menu = useRef(null);
  const [items] = useState([]);
  const [brands] = useState([{ name: "Brand A" }, { name: "Brand B" }]);
  const [colors] = useState([
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white" },
  ]);
  const [prices] = useState([{ range: "$0 - $50" }, { range: "$50 - $150" }]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [text, setText] = useState("");
  const [color1, setColor1] = useState("black");
  const [color2, setColor2] = useState("black");
  const [color3, setColor3] = useState("black");
  const [color4, setColor4] = useState("black");
  const [color5, setColor5] = useState("black");
  const [color6, setColor6] = useState("black");
  const [color7, setColor7] = useState("black");
  const [color8, setColor8] = useState("black");

  const toggleHelpSidebar = () => {
    setHelpSidebarVisible(!isHelpSidebarVisible);
  };

  useEffect(() => {
    const _getSchema = async () => {
      const _schema = await props.getSchema("category");
      const excludedFields = [
        "_id",
        "createdBy",
        "updatedBy",
        "createdAt",
        "updatedAt",
      ];

      const _fields = _schema.data
        .filter((f) => !excludedFields.includes(f.field))
        .map((f) => ({
          name: f.field
            .split(".")
            .map((part) =>
              part
                .replace(/([A-Z])/g, " $1")
                .trim()
                .replace(/\b\w/g, (c) => c.toUpperCase()),
            )
            .join(" "),
          value: f.field,
        }));

      setFields(_fields);

      const _hideFields = _schema.data
        .map((f, i) => i > 5 && f.field)
        .filter(Boolean);

      setSelectedHideFields(_hideFields);
    };

    _getSchema();
    props.hasServicePermission(filename).then(setPermissions);

    if (location?.state?.action === "create") {
      entityCreate(location, setRecord);
      setShowCreateDialog(true);
    } else if (location?.state?.action === "edit") {
      setShowCreateDialog(true);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    props.show();
    client
      .service("category")
      .find({
        query: {
          $limit: 10000,
          $populate: [
            { path: "createdBy", service: "users", select: ["name"] },
            { path: "updatedBy", service: "users", select: ["name"] },
          ],
        },
      })
      .then((res) => {
        let results = res.data;
        setData(results);
        props.hide();
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.hide();
        props.alert({
          title: "Category",
          type: "error",
          message: error.message || "Failed get Category",
        });
      });
  }, [showFakerDialog, showDeleteAllDialog, showEditDialog, showCreateDialog]);

  const onClickSaveFilteredfields = (ff) => {
    setSelectedFilterFields(ff);
    setShowFilter(false);
  };

  const onClickSaveHiddenfields = (ff) => {
    console.log(ff);
  };

  const onEditRow = (rowData, rowIndex) => {
    setSelectedEntityIndex(rowData._id);
    setShowEditDialog(true);
  };

  const onCreateResult = (newEntity) => {
    setData([...data, newEntity]);
  };
  const onFakerCreateResults = (newEntities) => {
    setSelectedEntityIndex();
    setData([...data, ...newEntities]);
  };
  const onSeederResults = (newEntities) => {
    setSelectedEntityIndex();
    setData([...data, ...newEntities]);
  };

  const onEditResult = (newEntity) => {
    let _newData = _.cloneDeep(data);
    _.set(_newData, { _id: selectedEntityIndex }, newEntity);
    setData(_newData);
  };

  const deleteRow = async () => {
    try {
      await client.service("category").remove(selectedEntityIndex);
      let _newData = data.filter((data) => data._id !== selectedEntityIndex);
      setData(_newData);
      setSelectedEntityIndex();
      setShowAreYouSureDialog(false);
    } catch (error) {
      console.log({ error });
      props.alert({
        title: "Category",
        type: "error",
        message: error.message || "Failed delete record",
      });
    }
  };

  const onRowDelete = (index) => {
    setSelectedEntityIndex(index);
    setShowAreYouSureDialog(true);
  };

  const onShowDeleteAll = (rowData, rowIndex) => {
    setShowDeleteAllDialog(true);
  };

  const deleteAll = async () => {
    setLoading(true);
    props.show();
    const countDataItems = data?.length;
    const promises = data.map((e) => client.service("category").remove(e._id));
    await Promise.all(
      promises.map((p) =>
        p.catch((error) => {
          props.alert({
            title: "Category",
            type: "error",
            message: error.message || "Failed to delete all records",
          });
          setLoading(false);
          props.hide();
          console.log({ error });
        }),
      ),
    );
    props.hide();
    setLoading(false);
    setShowDeleteAllDialog(false);
    await props.alert({
      title: "Category",
      type: "warn",
      message: `Successfully dropped ${countDataItems} records`,
    });
  };

  const onRowClick = ({ data }) => {
    navigate(`/category/${data._id}`);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
        <div className="surface-900 px-4 lg:px-8 py-3 lg:py-3 flex flex-column sm:flex-row w-full justify-content-between align-items-center">
          <span className="text-0">Sign Up for 15% off your first order</span>
          <a
            tabIndex="0"
            className="cursor-pointer h-full inline-flex align-items-center mt-3 sm:mt-0 md:py-0"
          >
            <img
              src="/photo/storefront/storefront-1-19.png"
              className="mr-2"
              alt="Flag"
            />
            <span className="text-0">MY</span>
          </a>
        </div>
        <div className="surface-overlay px-3 sm:px-7 flex flex-wrap align-items-stretch justify-content-between relative">
          <div className="flex align-items-center justify-content-center py-3">
            <img src="/photo/logos/peak-700.svg" alt="Image" height="40" />
          </div>
          <div className="hidden lg:flex align-items-center flex-auto justify-content-center">
            <ul className="list-none p-0 m-0 flex">
              <li className="flex flex-column lg:flex-row">
                <a
                  onClick={() => navigate("/categories/women")}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base"
                >
                  <span>Women</span>
                  <Ripple />
                </a>
              </li>
              <li className="flex flex-column lg:flex-row">
                <a
                  onClick={() => navigate("/categories/men")}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base"
                >
                  <span>Men</span>
                  <Ripple />
                </a>
              </li>
              <li className="flex flex-column lg:flex-row">
                <a
                  onClick={() => navigate("/categories/kids")}
                  className="p-ripple font-medium inline-flex align-items-center cursor-pointer border-left-2 lg:border-left-none lg:border-bottom-2 border-transparent hover:border-primary py-3 lg:py-0 px-6 lg:px-3 text-700 select-none text-xl lg:text-base lg:font-base"
                >
                  <span>Kids</span>
                  <Ripple />
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:flex w-full lg:w-auto hidden py-3 lg:py-0">
            <ul
              className="list-none p-0 m-0 flex w-full"
              style={{ minHeight: "30px" }}
            >
              <li className="flex flex-auto lg:flex-initial justify-content-center">
                <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:pr-3 hover:text-primary">
                  <i className="pi pi-search text-xl"></i>
                  <span className="hidden">Search</span>
                  <Ripple />
                </a>
              </li>
              <li className="flex flex-auto lg:flex-initial justify-content-center">
                <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary">
                  <i className="pi pi-heart text-xl"></i>
                  <span className="hidden">Favorites</span>
                  <Ripple />
                </a>
              </li>
              <li className="flex flex-auto lg:flex-initial justify-content-center">
                <Link
                  to="/login"
                  className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:px-3 hover:text-primary"
                >
                  <i className="pi pi-user text-xl"></i>
                  <span className="hidden">Sign In</span>
                  <Ripple />
                </Link>
              </li>
              <li className="flex flex-auto lg:flex-initial justify-content-center">
                <a className="p-ripple text-900 font-medium inline-flex align-items-center cursor-pointer lg:pl-3 pr-3 hover:text-primary">
                  <i className="pi pi-shopping-cart text-xl p-overlay-badge">
                    <Badge />
                  </i>
                  <span className="hidden">Cart</span>
                  <Ripple />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="flex justify-content-between flex-wrap">
          <div className="flex align-items-center mb-4 md:mb-0">
            <div className="text-900 font-bold text-3xl">Category Title </div>
            <Badge
              value={76}
              className="ml-3 bg-gray-200 text-gray-900 p-0 border-circle"
            />
          </div>
          <div>
            <Button
              icon="pi pi-sort-alt"
              className="p-button-outlined p-button-secondary w-7rem p-2"
              iconPos="right"
              label="Sort By"
              onClick={(event) => menu.current.toggle(event)}
            />
            <Menu ref={menu} popup model={items} />
          </div>
        </div>

        <p className="text-600 text-xl">
          Nullam faucibus, sem et bibendum finibus, sapien ipsum congue felis,
          sit amet pretium ex nisl ut eros.
        </p>
        <Divider className="w-full border-gray-200" />
        <div className="grid grid-nogutter align-items-center">
          <MultiSelect
            options={brands}
            value={selectedBrands}
            onChange={(e) => setSelectedBrands(e.value)}
            placeholder="Brand"
            optionLabel="name"
            filter
            maxSelectedLabels="2"
            selectedItemsLabel={`${selectedBrands && selectedBrands.length} brands selected`}
            className="flex-auto lg:flex-1 mb-3 lg:mt-0 w-full mr-0 lg:mr-4 text-900"
          />
          <MultiSelect
            options={colors}
            value={selectedColors}
            onChange={(e) => setSelectedColors(e.value)}
            placeholder="Color"
            optionLabel="name"
            filter
            maxSelectedLabels="2"
            selectedItemsLabel={`${selectedColors && selectedColors.length} colors selected`}
            className="flex-auto lg:flex-1 mb-3 lg:mt-0 w-full mr-0 lg:mr-4 text-900"
            itemTemplate={(color) => (
              <div className="flex align-items-center">
                <div
                  className={`w-2rem h-2rem border-circle ${color.class} cursor-pointer border-none`}
                ></div>
                <div className="text-900 ml-2">{color.name}</div>
              </div>
            )}
          />
          <MultiSelect
            options={prices}
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.value)}
            placeholder="Price"
            optionLabel="range"
            filter
            maxSelectedLabels="2"
            selectedItemsLabel={`${selectedPrice && selectedPrice.length} prices selected`}
            className="flex-auto lg:flex-1 mb-3 lg:mt-0 w-full mr-0 lg:mr-4 text-900"
          />
          <ToggleButton
            checked={checked1}
            onChange={(e) => setChecked1(e.value)}
            onLabel="Sustainable"
            offLabel="Unsustainable"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            className="mb-3 lg:mt-0 mr-4 flex-shrink-0 w-12rem"
          />
          <ToggleButton
            checked={checked2}
            onChange={(e) => setChecked2(e.value)}
            onLabel="Sale"
            offLabel="Not Sale"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            className="mb-3 lg:mt-0 mr-4 flex-shrink-0 w-9rem"
          />
          <a
            tabIndex="0"
            className="p-ripple cursor-pointer flex align-items-center mb-3 lg:mt-0 text-900"
          >
            Clear All
            <Ripple />
          </a>
          <div className="col-12">
            <div className="grid mt-4">
              <div className="col-12 md:col-6 lg:col-3 mb-5 lg:mb-0">
                <div className="mb-3 relative">
                  <Link to="/product/1">
                    <img
                      src="/photo/productlist/product-list-2-1.png"
                      className="w-full"
                      alt="product-list-2-1"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/1"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color1 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor1("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color1 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor1("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color1 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor1("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color1 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor1("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color1}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-5 lg:mb-0">
                <div className="mb-3 relative">
                  <Link to="/product/2">
                    <img
                      src="/photo/productlist/product-list-2-2.png"
                      className="w-full"
                      alt="product-list-2-2"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/2"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color2 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor2("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color2 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor2("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color2 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor2("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color2 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor2("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color2}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mb-5 lg:mb-0">
                <div className="mb-3 relative">
                  <Link to="/product/3">
                    <img
                      src="/photo/productlist/product-list-2-3.png"
                      className="w-full"
                      alt="product-list-2-3"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/3"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color3 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor3("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color3 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor3("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color3 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor3("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color3 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor3("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color3}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3">
                <div className="mb-3 relative">
                  <Link to="/product/4">
                    <img
                      src="/photo/productlist/product-list-2-4.png"
                      className="w-full"
                      alt="product-list-2-4"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/4"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color4 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor4("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color4 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor4("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color4 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor4("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color4 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor4("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color4}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mt-5 mb-5 lg:mb-0">
                <div className="mb-3 relative">
                  <Link to="/product/5">
                    <img
                      src="/photo/categorypreview/category-preview-1-28.png"
                      className="w-full"
                      alt="category-preview-1-28"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/5"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color5 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor5("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color5 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor5("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color5 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor5("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color5 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor5("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color5}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mt-5 mb-5 lg:mb-0">
                <div className="mb-3 relative">
                  <Link to="/product/6">
                    <img
                      src="/photo/categorypreview/category-preview-1-29.png"
                      className="w-full"
                      alt="category-preview-1-29"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/6"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color6 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor6("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color6 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor6("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color6 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor6("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color6 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor6("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color6}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mt-5 mb-5 lg:mb-0">
                <div className="mb-3 relative">
                  <Link to="/product/7">
                    <img
                      src="/photo/categorypreview/category-preview-1-30.png"
                      className="w-full"
                      alt="category-preview-1-30"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/7"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Product Name
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color7 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor7("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color7 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor7("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color7 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor7("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color7 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor7("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color7}</span>
                </div>
              </div>
              <div className="col-12 md:col-6 lg:col-3 mt-5">
                <div className="mb-3 relative">
                  <Link to="/product/123">
                    <img
                      src="/photo/productlist/product-list-2-1.png"
                      className="w-full"
                      alt="product"
                    />
                  </Link>
                  <button
                    type="button"
                    className="p-ripple border-1 border-white-alpha-20 border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer font-semibold"
                    style={{
                      bottom: "1rem",
                      left: "1rem",
                      width: "calc(100% - 2rem)",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                    <span className="text-base">Add to Cart</span>
                    <Ripple />
                  </button>
                </div>
                <div className="flex flex-column align-items-center">
                  <Link
                    to="/product/123"
                    className="text-xl text-900 font-medium mb-3"
                  >
                    Necklace
                  </Link>
                  <span className="text-xl text-900 mb-3">$150.00</span>
                  <div className="flex align-items-center mb-3">
                    <div
                      className="flex-shrink-0 border-circle bg-black-alpha-90 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color8 === "black"
                            ? "0 0 0 0.2rem var(--bluegray-900)"
                            : null,
                      }}
                      onClick={() => setColor8("black")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-bluegray-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color8 === "bluegray"
                            ? "0 0 0 0.2rem var(--bluegray-500)"
                            : null,
                      }}
                      onClick={() => setColor8("bluegray")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-green-500 mr-1 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color8 === "green"
                            ? "0 0 0 0.2rem var(--green-500)"
                            : null,
                      }}
                      onClick={() => setColor8("green")}
                    ></div>
                    <div
                      className="flex-shrink-0 border-circle bg-blue-500 cursor-pointer border-2 surface-border transition-all transition-duration-300"
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        boxShadow:
                          color8 === "blue"
                            ? "0 0 0 0.2rem var(--blue-500)"
                            : null,
                      }}
                      onClick={() => setColor8("blue")}
                    ></div>
                  </div>
                  <span className="text-500 capitalize">{color8}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider className="w-full border-gray-200 m-0" />
      <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-nogutter flex-wrap p-2 lg:p-4 bg-cyan-50 border-round mb-4 text-center lg:text-left">
          <div className="col-12 lg:col-6 p-4 flex flex-column justify-content-center">
            <span className="text-3xl block text-cyan-900 font-bold">
              Get Deals and Updates from Peak
            </span>
            <span className="block text-cyan-600 mt-3">
              We promise for not sending spam emails. It’ll only good emails.
            </span>
            <div
              className="p-inputgroup relative mt-4"
              style={{ borderRadius: "30px", maxWidth: "90%" }}
            >
              <InputText
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Email"
                style={{ borderRadius: "30px", height: "3.5rem" }}
                className="bg-white-alpha-90 text-black-alpha-90 px-4 border-cyan-100"
              />
              <Button
                type="button"
                label="Subscribe"
                className="bg-cyan-500 border-none absolute text-white"
                style={{
                  borderRadius: "30px",
                  right: "8px",
                  top: "8px",
                  height: "2.5rem",
                  zIndex: "1",
                }}
              />
            </div>
          </div>
          <div className="col-12 lg:col-6 p-4">
            <div
              className="w-full h-full bg-no-repeat bg-center bg-cover p-5"
              style={{
                background: "url(/photo/categorypage/categorypage-1-1.png)",
                borderRadius: "30px",
              }}
            >
              <span className="text-cyan-500 font-bold block">
                Exclusive Peak Club
              </span>
              <span className="text-white text-xl font-bold block mt-3 line-height-3">
                Join Exlusive Peak Club for free shipping, premium service and
                deals.
              </span>
              <Button
                type="button"
                label="Get Your Card Today"
                className="bg-cyan-500 border-none w-full mt-3 text-white"
                style={{ borderRadius: "30px" }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-nogutter text-center sm:text-left flex-wrap mt-8">
          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Company</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  About Peak
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Factories
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Environmental Initiatives
                </a>
              </li>
            </ul>
          </div>

          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Account</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Manage Account
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Saved Items
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  My Cart
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Wishlist
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Orders & Returns
                </a>
              </li>
            </ul>
          </div>

          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Legal</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Investor Relations
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Data Privacy
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Legal Information
                </a>
              </li>
            </ul>
          </div>

          <div className="col-12 sm:col-6 md:col-4 lg:col-3 flex-column mt-4">
            <span className="text-900 text-xl block">Connect</span>
            <ul className="list-none p-0">
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  tabIndex="0"
                  className="text-600 hover:text-900 transition-duration-150 cursor-pointer mt-3 block"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="surface-200 px-4 py-2 md:px-6 lg:px-8 flex flex-column lg:flex-row justify-content-between align-items-center">
        <div className="col-fixed flex flex-wrap flex-order-1 lg:flex-order-0 text-center lg:text-left">
          <span className="text-500">
            © 2022, Peak. Powered by PrimeBlocks.
          </span>
        </div>
        <div className="col-fixed flex align-items-center flex-order-0 lg:flex-order-1">
          <i className="pi pi-twitter p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-facebook p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-youtube p-1 text-sm text-900 cursor-pointer mr-3"></i>
          <i className="pi pi-google p-1 text-sm text-900 cursor-pointer mr-3"></i>
        </div>
      </div>

      <DownloadCSV
        data={data}
        fileName={filename}
        triggerDownload={triggerDownload}
        setTriggerDownload={setTriggerDownload}
      />
      <AreYouSureDialog
        header="Delete"
        body="Are you sure you want to delete this record?"
        show={showAreYouSureDialog}
        onHide={() => setShowAreYouSureDialog(false)}
        onYes={() => deleteRow()}
      />
      <AreYouSureDialog
        header={`Drop ${data?.length} records`}
        body={`Are you sure you want to drop ${data?.length} records?`}
        show={showDeleteAllDialog}
        onHide={() => setShowDeleteAllDialog(false)}
        onYes={() => deleteAll()}
        loading={loading}
      />
      <CategoryEditDialogComponent
        entity={_.find(data, { _id: selectedEntityIndex })}
        show={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        onEditResult={onEditResult}
      />
      <CategoryCreateDialogComponent
        entity={newRecord}
        onCreateResult={onCreateResult}
        show={showCreateDialog}
        onHide={() => setShowCreateDialog(false)}
      />
      <CategoryFakerDialogComponent
        show={showFakerDialog}
        onHide={() => setShowFakerDialog(false)}
        onFakerCreateResults={onFakerCreateResults}
      />
      <CategorySeederDialogComponent
        show={showSeederDialog}
        onHide={() => setShowSeederDialog(false)}
        onSeederResults={onSeederResults}
      />
    </>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  getSchema: (serviceName) => dispatch.db.getSchema(serviceName),
  hasServicePermission: (service) =>
    dispatch.perms.hasServicePermission(service),
  hasServiceFieldsPermission: (service) =>
    dispatch.perms.hasServiceFieldsPermission(service),
  show: () => dispatch.loading.show(),
  hide: () => dispatch.loading.hide(),
});

export default connect(mapState, mapDispatch)(CategoryPage);
