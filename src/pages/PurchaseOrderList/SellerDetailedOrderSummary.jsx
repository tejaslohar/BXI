import React, { useEffect, useState } from "react";
import { Paper, Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderSummaryByIdForBuyer } from "../../Hooks/OrderActions/useGetOrderSummaryByIdForBuyer";
import { getCompanyById } from "../../redux/action/CompanyActions";
import { useDispatch, useSelector } from "react-redux";
import { getOrderSummary } from "../../redux/action/OrderSummaryActions";
import { useMutatePurchaseOrder } from "../../Hooks/PurchaseOrderActions/useMutatePurchaseOrder";
import { toast, ToastContainer } from "react-toastify";

import POAcceptModal from "./POAcceptModal";
import PurchaseOrderDetails from "../BuyingJourneyPages/PurchaseOrderDetails";
import MediaPurchaseOrderDetails from "../BuyingJourneyPages/MediaPo";

const SellerDetailedOrderSummary = () => {
  let dispatch = useDispatch();
  const [mutateRespopnseLoading, setMutateResponseLoading] = useState(false);
  const [trueState, setTrueState] = useState(false);
  const [notificationOn, setNotificationOn] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [quantity, setQuantity] = useState({
    productId: "",
    quantity: "",
  });

  const [QuantityArr, setQuantityArr] = useState([]);

  const [isTransportation, setIsTransportation] = useState("true");

  const {
    data: OrderUpdateData,
    isLoading,
    error,
    mutate: OrderUpdateMutate,
  } = useMutatePurchaseOrder();

  const navigate = useNavigate();
  const { id } = useParams();

  const { data: orderSummaryData, isLoading: orderSummaryLoading } =
    useGetOrderSummaryByIdForBuyer(id);

  let IsMedia;
  orderSummaryData?.ProductData?.map((res) => {
    if (res?.ProductTypeName === "Media") {
      IsMedia = true;
    }
  });

  let orderData = [];

  for (let i = 0; i < orderSummaryData?.ProductData?.length; i++) {
    orderData.push(orderSummaryData.ProductData[i]);
  }

  let totalPrice = 0;
  orderData?.map((item) => {
    totalPrice += item.PricePerUnit * item.ProductQuantity;
  });

  const hello = async () => {
    const data = { IsPartialOrder: true, PartialOrderDetails: QuantityArr };
  };

  const handleClickOpen = () => {
    setOpen(true);
    setTrueState("1");
  };

  const { OrderSummary: OrderSummarydata, loading: OrderSummaryDataLoading } =
    useSelector((state) => state.OrderSummaryD);

  useEffect(() => {
    dispatch(getCompanyById(OrderSummarydata?.SellerCompanyId));
    dispatch(getOrderSummary(id));
  }, [dispatch, id]);

  console.log("OrderSummarydataOrderSummarydata", OrderSummarydata);

  let storeDataIds = [];
  let TotalQuantity = 0;
  let totalAmount = 0;
  let totalPricePerUnit = 0;
  let totatlTaxableAmount = 0;
  let totalGST = 0;
  let totalAmountWithGST = 0;
  let totalAmountWithTax = 0;
  let IGST = "true";
  let TotalAdditionalCostInRupee = 0;
  let TotalAdditionalCostInBXI = 0;
  OrderSummarydata?.ProductData?.map((item) => {
    storeDataIds.push(item);
    TotalQuantity += item.ProductQuantity;
    totalAmount += item.PricePerUnit * item.ProductQuantity;
    totalPricePerUnit += item.PricePerUnit;
    totatlTaxableAmount += item.PricePerUnit * item.ProductQuantity;
    totalGST += item.GST;
    totalAmountWithGST +=
      item?.PricePerUnit * item?.ProductQuantity * (item?.GST / 100);
    totalAmountWithTax +=
      item?.PricePerUnit * item?.ProductQuantity * (item?.GST / 100) +
      item?.PricePerUnit * item?.ProductQuantity;
    TotalAdditionalCostInRupee += item?.TotalAdditionalCostInRupee;
    TotalAdditionalCostInBXI += item?.TotalAdditionalCostInBXI;
  });

  if (
    OrderSummarydata?.BuyerDetails?.BuyerShippingAddress?.State ===
      OrderSummarydata?.SellerDetails?.SellerCompanyDetailedAddress?.state[0] ||
    OrderSummarydata?.BuyerDetails?.BuyerCompanyDetailedAddress?.state[0] ===
      OrderSummarydata?.SellerDetails?.SellerCompanyDetailedAddress?.state[0]
  ) {
    IGST = "false";
  } else {
    IGST = "true";
  }

  async function UpdateOrRejectThePurchaseOrder(props) {
    if (props === "Rejected") {
      OrderUpdateMutate({
        status: props,
        OrderSummaryId: id,
        IsMedia: OrderSummarydata?.IsMedia ? true : false,
      });
    } else {
      OrderUpdateMutate({
        status: props,
        OrderSummaryId: id,
        IsMedia: OrderSummarydata?.IsMedia ? true : false,
      });
    }
    setOpen(false);
  }

  useEffect(() => {
    if (OrderUpdateData?.data?.SellerInvoiceAcceptanceStatus === "Accepted") {
      toast.success("Purchase Order Accepted");
      setTimeout(() => {
        navigate("/home/sellerordersummary");
      }, 2000);
    } else if (
      OrderUpdateData?.data?.SellerInvoiceAcceptanceStatus === "Rejected"
    ) {
      // messages = `Sorry, PO generated by you has got rejected by ${OrderSummarydata?.SellerDetails?.SellerCompanyName}`;
      toast.error("Purchase Order Rejected");
      setTimeout(() => {
        navigate("/home/sellerordersummary");
      }, 2000);
    } else if (
      OrderUpdateData?.data?.SellerInvoiceAcceptanceStatus === "Pending"
    ) {
      toast.error("Something went wrong");
      setTimeout(() => {
        navigate(`/home/sellerdetailedordersummary/${id}`);
      }, 2000);
    }
  }, [OrderUpdateData]);

  return (
    <Paper
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        width: "100%",
      }}
      elevation={0}
    >
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {OrderSummarydata?.IsMedia ? (
        <MediaPurchaseOrderDetails SellerPage={true} Title={"Order Details"} />
      ) : (
        <PurchaseOrderDetails SellerPage={true} Title={"Order Details"} />
      )}

      {OrderSummarydata?.SellerOrderStatus === "Pending" &&
      !OrderSummarydata?.IsMedia ? (
        <POAcceptModal ProductId={id} />
      ) : (
        <Box
          sx={{
            width: "100%",
            mt: 3,
            pb: 3,
          }}
        >
          {OrderSummarydata?.IsMedia ? (
            <Box
              sx={{
                width: "100%",
                mt: 3,
                pb: 3,
              }}
            >
              <Box
                sx={{
                  maxWidth: "500px",
                  mx: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  height: "100%",
                }}
              >
                <Box
                  sx={ButtonStyleForAcceptAndReject}
                  onClick={() => {
                    UpdateOrRejectThePurchaseOrder("Accepted");
                    setNotificationOn("Accepted");
                    navigate(`/home/purchaseorderlist`);
                  }}
                >
                  Confirm
                </Box>

                <Box
                  sx={{
                    ...ButtonStyleForAcceptAndReject,
                    bgcolor: "#fff",
                    border: "1px solid #2261A2",
                    color: "#2261A2",
                  }}
                  onClick={() => {
                    UpdateOrRejectThePurchaseOrder("Rejected");
                    setNotificationOn("Rejected");
                  }}
                >
                  Cancel
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: "500px",
                mx: "auto",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                height: "100%",
              }}
            >
              {OrderSummarydata?.SellerOrderStatus === "Pending" &&
              !mutateRespopnseLoading ? (
                <Box sx={ButtonStyleForAcceptAndReject}>Accept </Box>
              ) : OrderSummarydata?.SellerOrderStatus === "Accepted" &&
                !mutateRespopnseLoading ? (
                <Box
                  sx={ButtonStyleForAcceptAndReject}
                  onClick={() => navigate("/home/sellerordersummary")}
                >
                  Continue{" "}
                </Box>
              ) : OrderSummarydata?.SellerOrderStatus === "Rejected" &&
                !mutateRespopnseLoading ? (
                <Box sx={ButtonStyleForAcceptAndReject}>Order Rejected</Box>
              ) : (
                <CircularProgress size={20} color="inherit" />
              )}

              {OrderSummarydata?.SellerOrderStatus === "Rejected" ||
              (OrderSummarydata?.SellerOrderStatus === "Accepted" &&
                !mutateRespopnseLoading) ? null : (
                <Box
                  sx={{
                    ...ButtonStyleForAcceptAndReject,
                    bgcolor: "#fff",
                    border: "1px solid #2261A2",
                    color: "#2261A2",
                  }}
                  onClick={handleOpen}
                >
                  Reject
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default SellerDetailedOrderSummary;

const ButtonStyleForAcceptAndReject = {
  width: "100%",
  height: "40px",
  maxWidth: "200px",
  borderRadius: "6px",
  bgcolor: "#2261A2",
  textTransform: "none",
  color: "#fff",
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "16px",
  color: "#FFFFFF",
  textAlign: "center",
  alignContent: "center",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  cursor: "pointer",
};
