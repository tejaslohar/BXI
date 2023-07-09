import React from "react";
import { Grid, Typography, Button, Paper } from "@mui/material";

import BreadCrumbHeader from "../../../components/Header/BreadCrumbHeader";
import { useState } from "react";
import GoLeft from "../../../assets/Images/CommonImages/GoLeft.png";
import { Box, Stack } from "@mui/system";
import makeStyles from "@mui/styles/makeStyles";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const useStyles = makeStyles((theme) => ({
  borderedText: {
    position: "relative",
    padding: "0 1rem",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      width: "50%",
      borderTop: "1px solid #E0E2EA",
    },
    "&::before": {
      left: 100,
    },
    "&::after": {
      right: 100,
    },
    "& span": {
      position: "relative",
      display: "inline-block",
      padding: "10px",
      backgroundColor: "#fff",
      zIndex: 1,
    },
  },
}));

const PhysicalDeliveryTypeArray = [
  {
    id: 1,
    name: "Single Upload",
    desc: "Single Media / Branding Offering and Specific only That Needs to be Selected ",
  },
  {
    id: 2,
    name: "Bulk Upload",
    desc: "Multiple Locations / Screens / Offerings / Pages / Spots ",
  },
];

const DigitalDeliveryTypeArray = [
  {
    id: 1,
    name: "Single Upload",
    desc: "Single Media / Branding Offering and Specific only That Needs to be Selected ",
  },
  {
    id: 2,
    name: "Bulk Upload ",
    desc: "Multiple Locations / Screens / Offerings / Pages / Spots",
  },
];

export default function MediaOnlinePhysical() {
  const [selectedOne, setSelectedOne] = useState(true);
  const [selectedTwo, setSelectedTwo] = useState(false);
  const [physicalData, setPhysicalData] = useState();
  const [digitalData, setDigitalData] = useState();
  console.log("physicalData", physicalData, "digitalData", digitalData);
  const classes = useStyles();

  const navigate = useNavigate();

  const [nameState, setnamestate] = useState(true);
  const NavigateFunction = () => {
    console.log(
      "naviagre",
      physicalData,
      digitalData,
      selectedOne,
      selectedTwo
    );
    console.log("selectedOne", selectedOne);
    console.log("selectedTwo", selectedTwo);

    if (!selectedOne && !selectedTwo) {
      // alert("Please select one option");
      return toast.error("Please Select One Option", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (physicalData === undefined && digitalData === undefined) {
      // alert("Please select one option");
      return toast.error("Please Select One Option", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (selectedOne && physicalData?.name === "Single Upload") {
      navigate("/home/mediaonline");
    } else if (selectedOne && physicalData?.name === "Bulk Upload") {
      navigate("/home/mediaonlinebulkupload");
    } else if (selectedTwo && digitalData?.name === "Single Upload") {
      navigate("/home/mediaoffline");
    } else {
      navigate("/home/mediaofflinebulkupload");
    }
  };
  return (
    <>
      <ToastContainer style={{ fontSize: "16px" }} />
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "transparent",
        }}
        elevation={0}
      >
        <BreadCrumbHeader title="Addcghfh Product " MainText={"Add Product "} />
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "#fff",
            borderRadius: "20px 20px 20px 20px",
          }}
        >
          <Grid container>
            <Box
              component={"img"}
              src={GoLeft}
              sx={{
                width: "22px",
                marginLeft: "2%",
                marginTop: "2%",
              }}
            />
            <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
              <Typography sx={Howwouldyou}>
                How would you deliver this to buyer ?
              </Typography>
              <Typography sx={subHowText}>
                Amplify Your Buyers Brand Message Loud, Lets Make Some Noice !
              </Typography>
              <Box sx={Box0}>
                <Button
                  onClick={() => {
                    setSelectedOne(true);
                    setSelectedTwo(false);
                  }}
                  sx={{
                    ...DigitalPhysicalButtonStyle,
                    border: selectedOne
                      ? "2px solid #445FD2"
                      : "2px solid #EDEFF2",
                    color: `${
                      selectedOne ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                    }`,
                    // color: `${
                    //   selectedTwo
                    //     ? "rgba(47, 47, 47, 1)"
                    //     : "rgba(47, 47, 47, 0.3)"
                    // }`,
                  }}
                >
                  {/* <Typography sx={singleupload}>Physical</Typography>
                <Typography sx={Typo1}>
                  Lorem ipsum dolor sit amet consectetur. Velit suspendisse
                  libero nunc.
                </Typography> */}
                  <Box sx={{ display: "flex", gap: "05px" }}>
                    <Typography sx={onText}>ON</Typography>
                    <Box sx={{ textAlign: "left", mt: 2 }}>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedOne ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Line
                      </Typography>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedOne ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Screen
                      </Typography>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedOne ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Air
                      </Typography>
                      {/* <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedOne ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Print
                      </Typography> */}
                    </Box>
                  </Box>
                </Button>
                <Button
                  onClick={() => {
                    setSelectedTwo(true);
                    setSelectedOne(false);
                  }}
                  sx={{
                    ...DigitalPhysicalButtonStyle,
                    border: selectedTwo
                      ? "2px solid #445FD2"
                      : "2px solid #EDEFF2",
                    color: `${
                      selectedTwo
                        ? "rgba(57, 61, 94, 0.5)"
                        : "rgba(57, 61, 94, 0.3)"
                    }`,
                  }}
                >
                  {/* <Typography sx={singleupload}>Digital</Typography>
                <Typography sx={Typo2}>
                  Lorem ipsum dolor sit amet consectetur. Velit suspendisse
                  libero nunc.
                </Typography> */}
                  <Box sx={{ display: "flex", gap: "05px" }}>
                    <Typography sx={onText}>OFF</Typography>
                    <Box
                      sx={{
                        textAlign: "left",
                        mt: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedTwo ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Line
                      </Typography>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedTwo ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Screen
                      </Typography>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedTwo ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Activation{" "}
                      </Typography>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedTwo ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Hoardings
                      </Typography>
                      <Typography
                        sx={{
                          ...SubOnText,
                          color: `${
                            selectedTwo ? "#6B7A99" : "rgba(107, 122, 153, 0.3)"
                          }`,
                        }}
                      >
                        Print
                      </Typography>
                    </Box>
                  </Box>
                </Button>
              </Box>
              {selectedOne ? (
                <Box
                  sx={{
                    textAlign: "center",
                    height: "auto",
                    display: selectedOne ? "block" : "none",
                  }}
                >
                  <Typography
                    className={classes.borderedText}
                    sx={ButtonClickTitle2}
                  >
                    <span>Availability of Product SKU / TYPE</span>
                  </Typography>
                  <Box
                    sx={{
                      maxWidth: "650px",
                      height: "auto",
                      display: "flex",
                      flexWrap: "wrap",
                      mx: "auto",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      mt: 2,
                    }}
                  >
                    {PhysicalDeliveryTypeArray?.map((res, idx) => {
                      return (
                        <Button
                          key={idx}
                          onClick={() => {
                            setPhysicalData(res);
                          }}
                          sx={{
                            ...ButtonChildStyle,
                            border:
                              physicalData?.id === res?.id
                                ? "2px solid #445FD2"
                                : "2px solid  #EDEFF2",
                            color: `${
                              physicalData?.id === res?.id
                                ? "rgba(57, 61, 94, 0.5)"
                                : "rgba(57, 61, 94, 0.3)"
                            }`,
                          }}
                          textTransform="none"
                        >
                          <Typography sx={singleupload}>{res.name}</Typography>
                          <Typography sx={singleuploadtext}>
                            {res.desc}
                          </Typography>
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    textAlign: "center",
                    display: selectedTwo ? "block" : "none",
                  }}
                >
                  <Typography
                    className={classes.borderedText}
                    sx={ButtonClickTitle1}
                  >
                    <span>Please ! Select your wallet Option</span>
                  </Typography>
                  <Box
                    sx={{
                      maxWidth: "650px",
                      height: "auto",
                      display: "flex",
                      flexWrap: "wrap",
                      mx: "auto",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      mt: 2,
                    }}
                  >
                    {DigitalDeliveryTypeArray?.map((res, idx) => {
                      return (
                        <Button
                          onClick={() => {
                            setDigitalData(res);
                          }}
                          sx={{
                            ...ButtonChildStyle,
                            border:
                              digitalData?.id === res?.id
                                ? "2px solid #445FD2"
                                : "2px solid  #EDEFF2",
                            color: `${
                              digitalData?.id === res?.id
                                ? "rgba(57, 61, 94, 0.5)"
                                : "rgba(57, 61, 94, 0.3)"
                            }`,
                          }}
                        >
                          <Typography sx={singleupload}>{res.name}</Typography>
                          <Typography sx={offerservicetext}>
                            {res.desc}
                          </Typography>
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: "grid",
                  gap: "10px",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  height: "auto",
                  width: "100%",
                  py: 5,
                  bgcolor: "transparent",
                }}
              >
                <Button
                  sx={{
                    width: "100%",
                    minWidth: {
                      xl: "600px",
                      lg: "600px",
                      md: "550px",
                      sm: "450px",
                      xs: "300px",
                    },
                    bgcolor: "#445FD2",
                    mx: "auto",
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    color: "#FFFFFF",
                    textTransform: "none",
                    height: "42px",
                    borderRadius: "10px",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "21px",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#445FD2",
                      border: "2px solid #445FD2",
                      opacity: 1,
                    },
                  }}
                  onClick={NavigateFunction}
                >
                  List Product
                </Button>
                <Button
                  sx={{
                    textTransform: "none",
                    width: "auto",
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                  variant="text"
                  onClick={() => {
                    navigate("/home");
                  }}
                >
                  Skip To Explore
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    </>
  );
}

const DigitalPhysicalButtonStyle = {
  borderRadius: "14px",
  display: "block",
  height: "auto",
  width: "250px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  p: 1,
  // mt: 2,
  // height: {
  //   xl: "121px",
  //   lg: "121px",
  //   md: "121px",
  //   sm: "121px",
  //   xs: "121px",
  // },
  // width: "auto",
  // maxWidth: {
  //   xl: "200px",
  //   lg: "200px",
  //   md: "200px",
  //   sm: "190px",
  //   xs: "170px",
  // },
  mx: "auto",
  ":hover": {
    opacity: 1,
    border: "2px solid #445FD2",
    background: "#FFFFFF",
  },
};

const onText = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: 74,
  // color: "#6B7A99",
};

const SubOnText = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: 12.3313,
  color: "rgba(47, 47, 47, 1)",
  textTransform: "none",
};
const subHowText = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 16,
  textAlign: "center",
  color: "rgba(57, 61, 94, 0.54)",
};
// const ButtonChildStyle = {
//   mt: 2,
//   borderRadius: "14px",
//   display: "block",
//   mx: "auto",
//   height: "160px",
//   maxHeight: {
//     xl: "160px",
//     lg: "171px",
//     md: "171px",
//     sm: "171px",
//     xs: "171px",
//   },
//   width: {
//     xl: "208px",
//     lg: "208px",
//     md: "208px",
//     sm: "208px",
//     xs: "208px",
//   },
//   overFlowY: "scroll",
//   ":hover": {
//     opacity: 1,
//     border: "2px solid #445FD2",
//     background: "#FFFFFF",
//   },
// };

const ButtonChildStyle = {
  borderRadius: "14px",
  display: "block",
  height: "auto",
  width: "250px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  p: 2,
  // mt: 2,
  // height: {
  //   xl: "121px",
  //   lg: "121px",
  //   md: "121px",
  //   sm: "121px",
  //   xs: "121px",
  // },
  // width: "auto",
  // maxWidth: {
  //   xl: "200px",
  //   lg: "200px",
  //   md: "200px",
  //   sm: "190px",
  //   xs: "170px",
  // },
  mx: "auto",
  ":hover": {
    opacity: 1,
    border: "2px solid #445FD2",
    background: "#FFFFFF",
  },
};

const Howwouldyou = {
  textAlign: "center",
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 600,
  width: "100%",
  mx: "auto",
  fontSize: {
    xl: "25.008px",
    lg: "24px",
    md: "22.4px",
    sm: "19.2px",
    xs: "16px",
  },
  color: "#393D5E",
};

const maindescription = {
  color: " rgba(57, 61, 94, 0.54)",
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontSize: {
    xl: "15px",
    lg: "15px",
    md: "15px",
    sm: "14px",
    xs: "12px",
  },
  fontWeight: 400,
  // letterSpacing: "0em",
  textAlign: "center",
  marginTop: "1%",
  width: {
    xl: "55%",
    lg: "55%",
    md: "70%",
    sm: "85%",
    xs: "90%",
  },
  mx: "auto",
};

const Box0 = {
  // mt: 3,
  // mb: 3,
  p: 5,

  // width: {
  //   xl: "90%",
  //   lg: "90%",
  //   md: "90%",
  //   sm: "90%",
  //   xs: "90%",
  // },
  height: "auto",
  width: "100%",
  mx: "auto",
  gap: "10px",
  maxWidth: "600px",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignContent: "center",
  alignItems: "center",
};
const Typo1 = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 10,
  //color: "rgba(57, 61, 94, 0.5)",
  // color: "red",
  textTransform: "none",
};
const Typo2 = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "10px",
  // color: "rgba(57, 61, 94, 0.5)",
  textTransform: "none",
};
const ButtonClickTitle1 = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "14px",
  color: "#6B7A99",
  width: "100%",
};
const offerservicetext = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "10px",
  color: "#ADB8CC",
  textTransform: "none",
};

const ButtonClickTitle2 = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "14px",
  color: "#6B7A99",
};
const singleupload = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: 16,
  color: "#6B7A99",
  marginBottom: "10%",
  textTransform: "none",
};
const singleuploadtext = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 500,
  fontSize: "10px",
  textAlign: "center",
  color: "rgba(57, 61, 94, 0.5)",
  textTransform: "none",
};
