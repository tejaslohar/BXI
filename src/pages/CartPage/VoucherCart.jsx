import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import BreadCrumbHeader from "../../components/Header/BreadCrumbHeader";
import StacsOfCoinIcon from "../../assets/BXITokenIcon.png";
import Rupieicon from "../../assets/CartPage/rupieicon.svg";

import addItemCartIcon from "../../assets/CartPage/addItemIcon.svg";
import TrashCanIcon from "../../assets/WishlistPage/TrashCanicon.svg";
import ClearIcon from "@mui/icons-material/Clear";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import {
  useRemoveCartProduct,
  useRemoveVoucherCartProduct,
} from "../../Hooks/ProductActions/useRemoveCartProduct";
import { useDispatch } from "react-redux";
import { useCreatePrchaseOrder } from "../../Hooks/OrderActions/useCreatePrchaseOrder";
import { BiCheckbox } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { get_Cart_Items } from "../../redux/action/CartActions";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  useGetCartData,
  useGetVoucherCartData,
} from "../../Hooks/ProductActions/useGetCartData";
import CommaSeprator from "../../components/CommaSeprator";
import axios from "axios";
import useStyles from "./Styles";
import { useGetAllCartVouchers } from "../../Hooks/VoucherActions/useGetAllCartVouchers";
import EmptyCart from "./EmptyCart";

const VoucherCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [balance, setBalance] = React.useState("");
  const [Order, setOrder] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const [CartRemoveData, setCartRemoveData] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { data: cartItems, refetch: cartRefetch } = useGetCartData();
  const { data: VoucherCartData, refetch: VoucherCartRefetch } =
    useGetVoucherCartData();
  const classes = useStyles();

  function storeData(params) {
    const orderData = Order.find((el) => el._id === params._id);
    if (orderData) {
    } else {
      setOrder([...Order, params]);
    }
  }

  function removeData(params) {
    const orderData = Order.find((el) => el._id === params._id);
    if (orderData) {
      const newOrder = Order.filter((el) => el._id !== params._id);
      setOrder(newOrder);
    } else {
      console.log("not exist");
    }
  }

  const reqBalance = async () => {
    await axios
      .get("wallet/mywallet", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res wallet", res);
        setBalance(res?.data?.data?.balance);
      });
  };

  useEffect(() => {
    reqBalance();
  }, []);
  let totalPrice = 0;
  let Totalgst = 0;
  let totalQuantity = 0;
  let dataId = [];
  let TotalGSTAmount = 0;
  let TotalAdditionalCostInRupee = 0;
  let TotalAdditionalCostInBXI = 0;
  let ToTalGstPercentage = 0;
  let TotalfinalPrice = 0;
  let TotalQuantity = 0;
  let TotalPriceExcludingGST = 0;
  let GrandTotal = 0;

  let ObjectForBuy = [];

  Order?.map((el) => {
    ObjectForBuy.push({
      ProductId: el.ProductId._id,
      ProductName: el.ProductId.ProductName,
      ProductPrice: el.PricePerUnit * el.VoucherQuantity,
      ProductQty: el.VoucherQuantity,
      ProductDesc: el.ProductId.ProductDesc,
      SellerCompanyId: el.ProductId.SellerCompanyId,
      ProductsVariantionId: el.ProductsVariantionId,
      TotalAdditionalCostInRupee: el.TotalAdditionalCostInRupee,
      TotalAdditionalCostInBXI: el.TotalAdditionalCostInBXI,
    });
    GrandTotal += el?.TotalPriceWithGST;
    TotalPriceExcludingGST += el?.TotalPriceWithoutGST;
    TotalGSTAmount = TotalGSTAmount + el.TotalGSTAmount;
    TotalQuantity = TotalQuantity + el.VoucherQuantity;
    ToTalGstPercentage += el?.ProductGst;
    totalPrice = totalPrice + el.DiscountedPrice;
    Totalgst += el?.TotalGST;
    totalQuantity = totalQuantity + el.VoucherQuantity;
    TotalAdditionalCostInRupee += el.TotalAdditionalCostInRupee;
    TotalAdditionalCostInBXI += el.TotalAdditionalCostInBXI;
    dataId.push(el._id);
  });

  TotalfinalPrice =
    GrandTotal +
    TotalGSTAmount +
    TotalAdditionalCostInRupee +
    TotalAdditionalCostInBXI;

  const { mutate: removeCartProduct, refetch: removeCartProductRefetch } =
    useRemoveCartProduct();
  const { mutate: removeVoucherCartProduct } = useRemoveVoucherCartProduct();

  const { data: mutatedata, mutate: createOrder } = useCreatePrchaseOrder();

  useEffect(() => {
    if (mutatedata?.data === "Order Created") {
      toast.success("Order Created", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        navigate("/home/purchaseorderlist");
      }, 2000);
    } else if (mutatedata?.data === "OrderSummary validation failed") {
      toast.error("OrderSummary validation failed", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [mutatedata]);

  async function handleRemoveCartProduct(id) {
    cartRefetch();
    removeCartProduct(id);
    cartRefetch();
  }

  async function handleRemoveVoucherfromCart(id) {
    removeVoucherCartProduct(id);
    VoucherCartRefetch();
    setOpen(false);
  }
  async function handleRemoveMultipleCartProduct() {
    dataId.map((el) => {
      removeCartProduct(el);
      cartRefetch();
    });
    cartRefetch();
    setOrder([]);
  }

  async function handleCreateOrder() {
    if (balance < Number(TotalfinalPrice) + Number(TotalAdditionalCostInBXI)) {
      alert("Your Wallet balance is low");
    } else {
      await axios
        .post(
          "voucher/buy_voucher",
          { ObjectForBuy },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res?.data === "Order Created") {
            toast.success("Order Crated", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            setTimeout(() => {
              navigate("/home/voucherorderlist");
            }, 2000);
          }
        });
    }
    cartRefetch();
  }

  useEffect(() => {
    dispatch(get_Cart_Items());
  }, []);

  return (
    <Paper sx={{ bgcolor: "transparent" }} elevation={0}>
      <ToastContainer style={{ fontSize: "16px" }} />

      {VoucherCartData?.length > 0 ? (
        <React.Fragment>
          <Box
            sx={{
              marginTop: "50px",
            }}
          >
            {VoucherCartData?.map((el, idx) => {
              console.log("ellllllll", el);
              return (
                <Box key={idx}>
                  <Box className={classes.rootbox}>
                    <Box className={classes.rootboxChildOne}>
                      <Box
                        className={classes.cartProductStrip}
                        sx={{
                          backgroundImage: `url(${el?.VoucherUImage})`,
                        }}
                      ></Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          alignContent: "start",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <Typography
                          sx={{
                            ...ProductNameTextStyle,
                            width: "300px",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                          }}
                        >
                          {el?.ProductId?.ProductName}
                        </Typography>
                        <Typography
                          sx={{
                            ...ProductMetaTextStyle,
                            width: "300px",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontFamily: "Poppins",
                            fontWeight: 500,
                          }}
                        >
                          {el?.ProductId?.ProductDescription}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            alignContent: "center",
                            width: "100%",
                          }}
                        >
                          <Typography sx={ProductPriceTextStyle}>
                            <img
                              src={StacsOfCoinIcon}
                              alt="rupieicon"
                              style={{
                                width: "20px",
                                height: "auto",
                              }}
                            />
                          </Typography>
                          <Typography
                            sx={{
                              ...ProductPriceTextStyle,
                              marginTop: "-03px",
                            }}
                          >
                            &nbsp;
                            <CommaSeprator Price={el?.PricePerUnit} />
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: "120px",
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      {dataId.includes(el._id) ? (
                        <Box
                          onClick={() => {
                            removeData(el);
                          }}
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          <img src={addItemCartIcon} size={30} />
                        </Box>
                      ) : (
                        <Box
                          onClick={() => {
                            storeData(el);
                          }}
                          sx={{
                            cursor: "pointer",
                          }}
                        >
                          <BiCheckbox size={30} />
                        </Box>
                      )}

                      <Box
                        onClick={() => {
                          handleClickOpen();
                          setCartRemoveData({
                            id: el._id,
                            ProductName: el?.ProductId?.ProductName,
                          });
                          // removeVoucherCartProductRefetch();
                        }}
                      >
                        <IoClose
                          size={25}
                          style={{
                            cursor: "pointer",
                          }}
                          sx={{
                            color: "rgba(104, 107, 111, 1)",
                            fontSize: "2rem",
                            cursor: "pointer",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Grid
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            sx={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: {
                xl: "row",
                lg: "row",
                md: "row",
                sm: "row",
                xs: "column",
              },
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "2rem",
                bgcolor: "transparent",
                justifyContent: "flex-start",
              }}
            >
              {" "}
              <Box
                component={"img"}
                src={addItemCartIcon}
                alt="icon"
                style={{ cursor: "pointer" }}
              ></Box>
              <Typography sx={{ ...cartSelectionTextStyle, display: "flex " }}>
                {Order?.length}/{VoucherCartData?.data?.length}
                &nbsp;Items&nbsp;Selected&nbsp; (&nbsp;
                {totalPrice ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <img
                      src={StacsOfCoinIcon}
                      style={{
                        width: "auto",
                        height: "23px",
                        marginRight: "5px",
                      }}
                      alt="rupieicon"
                    />
                    <Typography sx={cartSelectionTextStyle}>
                      <CommaSeprator Price={totalPrice} />
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <img
                      src={StacsOfCoinIcon}
                      style={{
                        width: "23px",
                        height: "auto",
                      }}
                      alt="rupieicon"
                    />
                    <Typography sx={cartSelectionTextStyle}>0</Typography>
                  </Box>
                )}
                &nbsp;)
                {"   "}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: "2rem" }}>
              {" "}
              <Box
                component={"img"}
                src={TrashCanIcon}
                alt="trashIcon"
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleRemoveMultipleCartProduct();
                }}
              ></Box>
            </Box>
          </Grid>
          {Order?.length === 0 ? null : (
            <React.Fragment>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  background: "#fff",
                  padding: "4rem",
                  borderRadius: "10px",

                  marginTop: "2rem",
                }}
              >
                <Typography sx={{ ...cartSelectionTextStyle }}>
                  PRICE DETAILS&nbsp;({Order?.length} Items){"   "}
                </Typography>

                <TableContainer sx={{ marginTop: "3rem", width: "100%" }}>
                  <TableHead>
                    <TableRow sx={{ height: "42px", bgcolor: "#2261A2" }}>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD", width: "50px" }}
                      >
                        <Typography sx={TableTextStyle}> S. No.</Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={2}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>
                          Product Name
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>
                          Price / Unit{" "}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>Quantity</Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>GST Rate</Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>
                          Total Price (Excluding gst)
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>GST Amount</Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>
                          Additional Cost INR
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableTextStyle}>
                          Additional Cost BXI Coins
                        </Typography>
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={{
                          bgcolor: "#2261A2",
                          width: "170px",
                          borderLeft: "1px solid #CDCDCD",
                        }}
                      >
                        <Typography sx={TableTextStyle}>Grand Total</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Order?.map((row, idx) => {
                      let AdCostInInr = 0;
                      let AdCostInBXI = 0;
                      row?.AdditionCostArrayData?.map((item) => {
                        if (item?.currencyType === "₹") {
                          AdCostInInr = AdCostInInr + item?.TotalWithGst;
                        } else {
                          AdCostInBXI = AdCostInBXI + item?.TotalWithGst;
                        }
                      });

                      let TotalFinal =
                        row?.Total +
                        row?.TotalGSTAmount +
                        row?.TotalAdditionalCostInBXI +
                        row?.TotalAdditionalCostInRupee;

                      return (
                        <TableRow
                          sx={{
                            height: "42px",
                            backgroundColor: "#fff",
                          }}
                        >
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{
                              borderRight: "1px solid #CDCDCD",
                              borderLeft: "1px solid #CDCDCD",
                            }}
                          >
                            <Typography sx={TableBottomtext}>
                              {idx + 1}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="left"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography
                              sx={{
                                ...TableBottomtext,
                                fontSize: "14px",
                                width: "300px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row?.ProductId?.ProductName}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator Price={row?.PricePerUnit} />
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator Price={row?.VoucherQuantity} />
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator Price={row?.ProductGst} />
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator
                                Price={row?.TotalPriceWithoutGST}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator Price={row?.TotalGST} />
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              {" "}
                              <CommaSeprator
                                Price={row?.TotalAdditionalCostInRupee}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator
                                Price={row?.TotalAdditionalCostInBXI}
                              />
                            </Typography>
                          </TableCell>

                          <TableCell
                            align="center"
                            colSpan={1}
                            rowSpan={1}
                            sx={{ borderRight: "1px solid #CDCDCD" }}
                          >
                            <Typography sx={TableBottomtext}>
                              <CommaSeprator
                                Price={
                                  row?.TotalPriceWithGST +
                                  row?.TotalAdditionalCostInRupee +
                                  row?.TotalAdditionalCostInBXI
                                }
                              />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow
                      sx={{
                        height: "42px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <TableCell
                        align="center"
                        colSpan={3}
                        rowSpan={3}
                        sx={{
                          borderRight: "1px solid #CDCDCD",
                          borderLeft: "1px solid #CDCDCD",
                        }}
                      >
                        <Typography sx={TableBottomtext}>Total</Typography>
                      </TableCell>

                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator Price={TotalQuantity} />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator Price={ToTalGstPercentage} />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator Price={TotalPriceExcludingGST} />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator Price={Totalgst} />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator Price={TotalAdditionalCostInRupee} />
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator Price={TotalAdditionalCostInBXI} />
                        </Typography>
                      </TableCell>

                      <TableCell
                        align="center"
                        colSpan={1}
                        rowSpan={1}
                        sx={{ borderRight: "1px solid #CDCDCD" }}
                      >
                        <Typography sx={TableBottomtext}>
                          <CommaSeprator
                            Price={
                              Totalgst +
                              TotalPriceExcludingGST +
                              TotalAdditionalCostInRupee +
                              TotalAdditionalCostInBXI
                            }
                          />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
                <Button
                  sx={CreateOrderButtonStyle}
                  onClick={() => {
                    handleCreateOrder();
                  }}
                >
                  Place Order
                </Button>
              </Grid>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <EmptyCart />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {CartRemoveData?.ProductName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this item from cart?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => handleRemoveVoucherfromCart(CartRemoveData?.id)}
            autoFocus
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default VoucherCart;

const SelectedItemsTetxStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "27px",
  color: "#6B7A99",
};

const InfoBoxAmountText = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "24px",
  color: " #282828",
};

const ProductNameTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: {
    xl: "18px",
    lg: "18px",
    md: "17px",
    sm: "13px",
    xs: "13px",
  },
  lineHeight: "25px",
  color: "#6B7A99",
  textAlign: "left",
};
const ProductMetaTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 300,
  fontSize: {
    xl: "12px",
    lg: "12px",
    md: "11px",
    sm: "9px",
    xs: "9px",
  },
  lineHeight: {
    xl: "18px",
    lg: "18px",
    md: "15px",
    sm: "14px",
    xs: "14px",
  },
  color: "#858585",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const ProductPriceTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  color: "rgba(107, 122, 153, 0.5)",
  fontSize: {
    xl: "18px",
    lg: "18px",
    md: "18px",
    sm: "15px",
    xs: "15px",
  },
  lineHeight: {
    xl: "21px",
    lg: "21px",
    md: "19px",
    sm: "18px",
    xs: "17px",
  },
  alignContent: "center",
  alignItems: "center",
};

const cartSelectionTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "25px",
  color: "#6B7A99",
};

const TableBottomtext = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "12px",
  lineHeight: "20px",

  color: "#505050",
};

const TableTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "20px",
  color: "#FFFFFF",
};

const CreateOrderButtonStyle = {
  width: "100%",
  height: "50px",
  background: "#E0F0FF",
  borderRadius: "10px",
  textTransform: "none",
  fontFamily: "Poppins",
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "21px",
  color: "#445FD2",
  mt: 1,
  "&:hover": {
    background: "#E0F0FF",
    color: "#445FD2",
  },
};
