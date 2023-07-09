import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  BottomNavigation,
  TextField,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Fade,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import InfoIcon from "../../../../assets/InfoIcon.svg";
import RedoIcon from "../../../../assets/Images/CommonImages/RedoIcon.svg";
import help from "../../../../assets/Help.svg";
import UploadtoCloud from "../../../../assets/UploadtoCloud.svg";
import DeleteIcon from "../../../../assets/Images/CommonImages/DeleteIcon.svg";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";
import ToolTip from "../../../../components/ToolTip";
import { getImageSize } from "react-image-size";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";

export default function TextileGoLive() {
  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip
      {...props}
      componentsProps={{ tooltip: { className: className } }}
    />
  ))(`
          background: #445fd2;
          width:200px;
      `);

  const navigate = useNavigate();
  const id = useParams().id;
  const [loader, setLOader] = useState(false);
  const [files, setFiles] = useState([]);
  const [sizechart, setSizeChart] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Select");
  const [progress, setProgress] = React.useState(0);
  const [storeImages, setStoreImages] = useState();
  const [FileNameErrorfordimanesion, setFileNameErrorForDimension] = useState();
  const [ListPeriod, setListPeriod] = useState();
  const [formError, setFormError] = useState(false);

  const [FileNameErrorForSize, setFileNameErrorForSize] = useState();

  async function fetchImageSize() {
    try {
      const dimensions = await getImageSize("https://example.com/image.jpg");
      console.log(dimensions);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(
    "FileNameErrorfordimanesion",
    FileNameErrorfordimanesion,
    FileNameErrorForSize
  );

  const inputRef = useRef();
  const sizechartRef = useRef();
  const productId = useParams().id;

  useEffect(() => {
    if (files) {
      let NewData = [];
      for (let i = 0; i < files.length; i++) {
        NewData.push(files[i]);
      }
      setStoreImages(NewData);
      console.log(NewData);
    }
  }, [files]);
  const [showContent, setShowContent] = useState(false);

  const handleCheckboxChange = (event) => {
    setShowContent(event.target.checked);
  };
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setLOader(true);
    setTimeout(() => {
      setLOader(false);
    }, [5000]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDropSizechart = (event) => {
    event.preventDefault();
    setSizeChart(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFiles(event.dataTransfer.files);
  };

  // if (files?.length > 0) {
  //   for (let index = 0; index < files.length; index++) {
  //     Filarray.push(files[index]);
  //   }
  // }

  // send files to the server //
  const handleUpload = () => {
    setFiles(files);
    setLOader(true);
    setTimeout(() => {
      setLOader(false);
    }, [5000]);
  };
  const handleChangeFiles = (event) => {
    const files = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const uploadData = async (event) => {
    event.preventDefault();
    var formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("id", productId);
    formData.append("sizechart", sizechart);
    formData.append("listperiod", ListPeriod);

    let FilarrayForDimension = [];
    let FilearrayforSize = [];
    let ReadyToUplaod = true;

    if (files?.length >= 6 && files?.length <= 7) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const dataUrl = await readFileAsDataURL(file);
          const img = await loadImage(dataUrl);

          if (file.size <= Number(1000000)) {
            if (img.width > Number(1070) || img.height > Number(1585)) {
              FilarrayForDimension.push(file.name);
              ReadyToUplaod = false;
            } else {
              console.log("files[i].name else", file.name);
            }
          } else {
            FilearrayforSize.push(file.name);
            ReadyToUplaod = false;
          }
        } catch (error) {
          console.log("Error processing file:", file.name, error);
        }
      }
    } else {
      // alert("Please select at least 6 Product Images");
      return toast.error("Please upload at least 6 images", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      ReadyToUplaod = false;
      setFormError(true);
    }

    setFileNameErrorForDimension(FilarrayForDimension);
    setFileNameErrorForSize(FilearrayforSize);
    if (Number(ListPeriod) > 365) {
      // alert("Please select the list period less than 365 days");
      return toast.error("Please select the list period less than 365 days", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      if (
        FilarrayForDimension?.length <= 0 &&
        FilearrayforSize?.length <= 0 &&
        ReadyToUplaod === true
      ) {
        // Rest of the code...
        axios({
          method: "post",
          url: "/product/product_mutation",
          data: formData,
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded * 100) / total);
          },
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        })
          .then((res) => {
            navigate("/home/RestaurantProductPreview/" + id);
          })
          .catch((err) => console.log(err));
      } else {
        ReadyToUplaod = false;
        // toast.error("Image dimension or Size issue");
        return toast.error("Image dimension or Size issue", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFormError(true);
      }
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = src;
    });
  };

  return (
    <>
      <form>
        <Box
          sx={{
            maxWidth: "716px",
            height: "100%",
            // minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 10px 20px rgba(220, 220, 220, 0.5)",
            px: "20px",
            // backgroundColor: "red",
            backgroundColor: "#f3f6f9",
          }}
        >
          <Box
            sx={{
              width: "100%",
              mx: "auto",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "10px",
              py: "10px",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: "14px",
                textTransform: "none",
                color: "#6B7A99",
              }}
            >
              Go Live
            </Typography>
            <ToolTip
              info={
                "Go Live is the time at which something becomes available to use and purchased by other members on the platform."
              }
            />
          </Box>
          {/* <Box sx={{ width: "90%" }}>
          <FormControlLabel
            sx={CommonTextStyle}
            control={
              <Checkbox
                checked={showContent}
                onChange={handleCheckboxChange}
                name="showContent"
                color="primary"
              />
            }
            label=" Installation & Demo"
          />
        </Box> */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              px: "20px",
              width: "90%",
            }}
          >
            {" "}
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: 12,
                color: "#6B7A99",
                p: "2%",
              }}
            >
              Upload Image & Video
            </Typography>
            <CustomTooltip
              title={
                <Typography
                  sx={ToolTextStyle}
                >{`Mandatory Photos : 3 Clear Product Photos with White Background , High Resolution , Close View , Distant View , If on Display / in Use View , Kindly add Size Chart / Dimension Photos Separetly in the Below Link. ( 5 Photos + 1 Video ) Mandatory`}</Typography>
              }
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 400 }}
            >
              <img
                src={help}
                style={{
                  cursor: "pointer",
                }}
              />
            </CustomTooltip>
          </Box>
          <Box
            onClick={() => inputRef.current.click()}
            sx={{
              border: "2px dashed #445FD2",
              background: "#fff",
              width: "80%",
              maxWidth: "670px",
              p: "4%",
              mx: "auto",
              position: "relative",
              cursor: "pointer",
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Box
              sx={{
                display: "grid",
                width: "60%",
                mx: " auto",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                  tetxAlign: "center",
                }}
              >
                <Box
                  component="img"
                  src={UploadtoCloud}
                  sx={{
                    position: "absolute",
                    left: "5%",
                    textalign: "center",
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "10px",
                    color: "#6B7A99",
                    cursor: "pointer",
                    "&:hover": {
                      color: "#445FD2",
                    },
                    textalign: "center",
                  }}
                >
                  Drag & Drop upload or{" "}
                  <span style={{ color: "#445FD2", fontWeight: 500 }}>
                    {" "}
                    browse{" "}
                  </span>{" "}
                  to choose a file
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Mulish",
                    fontStyle: "normal",
                    fontWeight: 400,
                    fontSize: "7px",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    color: "#676767",
                    // width: "30%",
                    mx: "auto",
                  }}
                >
                  Size Limit & Format ( JPEG , PNG - 1 MB , PDF - 5 MB , GIF ,
                  MP4 - 5 MB )
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "center", mt: "1%" }}>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: {
                    xl: "10px",
                    lg: "10px",
                    md: "10px",
                    sm: "8px",
                    xs: "8px",
                  },
                  color: "#445FD2",
                }}
              >
                Aspect Ratio 32 : 9 (3840 X 1080 ) OR 16 : 9 ( 1920 X 1080){" "}
                {/* Mandatory Photos : Front View, Back View, Close Fabric View, Model
              Wearing View , Size Chart & Privacy Policy */}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: {
                    xl: "9px",
                    lg: "9px",
                    md: "9px",
                    sm: "8px",
                    xs: "8px",
                  },
                  color: "#445FD2",
                }}
              >
                Mandatory Photos : Product related Photos
              </Typography>
            </Box>
            <input
              type="file"
              multiple
              // onChange={(event) => setFiles(event.target.files)}
              onChange={handleChangeFiles}
              hidden
              accept=".png,.pdf,.mp4,.jpeg,.gif"
              ref={inputRef}
            />
          </Box>
          {files ? (
            <Box
              sx={{
                width: "90%",
                my: "2%",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 400,
                  fontSize: "10px",
                  color: "#6B7A99",
                }}
              >
                Uploaded
              </Typography>

              {Array?.from(files)?.map((file, idx) => {
                return (
                  <Box
                    sx={{
                      background: "#fff",
                      border: "1px solid green",
                      borderRadius: "9px",
                      height: "42px",
                      width: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      my: "10px",
                      px: "8px",
                    }}
                  >
                    <Typography
                      key={idx}
                      sx={{
                        fontFamily: "Poppins",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "10px",
                        color: "#6B7A99",
                      }}
                    >
                      {file?.name}
                    </Typography>
                    <Box
                      component="img"
                      src={DeleteIcon}
                      sx={{
                        height: "20px",
                        width: "20px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        const newFiles = Array.from(files);
                        newFiles.splice(idx, 1);
                        setFiles(newFiles);
                      }}
                    />
                  </Box>
                );
              })}

              <Box>
                <Typography>Dimension Issue: </Typography>
                {FileNameErrorfordimanesion?.map((res) => {
                  return <Typography sx={{ color: "red" }}>{res}</Typography>;
                })}
              </Box>
              <Box>
                <Typography>Size Issue:</Typography>
                {FileNameErrorForSize?.map((res) => {
                  return <Typography sx={{ color: "red" }}>{res}</Typography>;
                })}
              </Box>
            </Box>
          ) : (
            " "
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "90%",
            }}
          >
            <Typography sx={{ ...CommonTextStyle, pt: "10px" }}>
              branch list
            </Typography>
            <Box
              onClick={() => inputRef.current.click()}
              sx={{
                border: "2px dashed #445FD2",
                background: "#fff",
                borderRadius: "5px",
                width: "80%",
                maxWidth: "670px",
                p: "4%",
                mx: "auto",
                position: "relative",
                width: "90%",
                cursor: "pointer",
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Box
                sx={{
                  display: "grid",
                  width: "60%",
                  mx: " auto",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    tetxAlign: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={UploadtoCloud}
                    sx={{
                      position: "absolute",
                      left: "5%",
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "10px",
                      color: "#6B7A99",
                      cursor: "pointer",
                      "&:hover": {
                        color: "blue",
                      },
                    }}
                  >
                    Drag & drop upload or
                    <span style={{ color: "#445FD2", fontWeight: 500 }}>
                      {" "}
                      browse{" "}
                    </span>{" "}
                    to choose a file
                  </Typography>
                </Box>
              </Box>
              <input
                type="file"
                onChange={(event) => setFiles(event.target.files[0])}
                hidden
                accept=".png,.pdf,.mp4,.jpeg,.gif"
                ref={inputRef}
              />
            </Box>

            {files ? (
              <div>
                <ol>
                  {/* {Array?.from(files)?.map((file, idx) => ( */}
                  <li>{files?.name}</li>
                  {/* ))} */}
                </ol>
                <div>
                  <button onClick={() => setFiles(0)}>Cancel</button>
                  {/* <button onClick={handleUpload}>Upload</button> */}
                </div>
              </div>
            ) : (
              " "
            )}
            {loader ? (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  backgroundColor: "transparent",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#445FD2",
                  },
                }}
              />
            ) : null}
          </Box>

          <Box sx={{ width: "90%", mx: "auto", mt: 2 }}>
            <Typography sx={Text}>
              {" "}
              List this product for number of days ( maximum 365 days )
            </Typography>
            <Box
              sx={{
                width: "100%",
                // maxWidth: "1000px",
                height: "42px",
                mt: "1%",
                borderRadius: "10px",
              }}
            >
              <TextField
                id="standard-basic"
                variant="standard"
                placeholder="100"
                // onChange={(e) => {
                //   setListPeriod(e.target.value);
                // }}
                // {...register("List")}
                onChange={(e) => {
                  setListPeriod(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === " " && e.target.selectionStart === 0) {
                    e.preventDefault();
                  }
                }}
                InputProps={{
                  disableUnderline: "true",
                  style: {
                    color: "#445FD2",
                    fontSize: "14px",
                    padding: "7px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "red",
                  },
                }}
                sx={{
                  width: "80%",
                  height: "100%",
                  background: "#FFFFFF",
                  borderRadius: "10px 0px 0px 10px",
                }}
              />

              <Select
                sx={GW}
                defaultValue={"Days"}
                // {...register("ListPeriod")}
              >
                <MenuItem sx={MenuItems} value="Days">
                  Days
                </MenuItem>
              </Select>
              {/* <Typography sx={ErrorStyle}>{errors["List"]?.message}</Typography> */}
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              mt: 10,
            }}
          >
            <BottomNavigation
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                bgcolor: "#f3f6f9",
                p: "5px",
                // boxShadow: "0px 10px 20px rgba(220, 220, 220, 0.5)",
              }}
              showLabels
            >
              {/* <Button
                sx={{
                  marginRight: "auto",
                  p: "2%",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  color: "#6B7A99",
                  fontSize: 14,
                  display: "flex",
                  gap: "10px",
                  textTransform : "none"
                }}

                onClick={() => {
                  setFiles([])
                  setSizeChart(null)
                  setListPeriod("")
                }}
              >
                <Box
                  component="img"
                  sx={{ width: "23px", height: "23px" }}
                  src={RedoIcon}
                  alt=""
                />
                Reset to Default
              </Button> */}
              <Box sx={{ display: "flex", gap: "10px", p: 1, width: "50%" }}>
                <Button
                  sx={{
                    width: "100%",
                    height: "32px",
                    borderRadius: "10px",
                    background: "#fff",
                    color: "#636161",
                    fontSize: "14px",
                    textTransform: "none",
                    "&:hover": {
                      background: "#f3f6f9",
                      color: "#000",
                    },
                  }}
                  variant="contained"
                  onClick={() => {
                    let confirm = window.confirm(
                      "Are you sure you want to cancel the product?"
                    );
                    if (confirm) {
                      navigate("/home/mylistedproducts");
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    width: "100%",
                    height: "32px",
                    borderRadius: "10px",
                    background: "#445FD2",
                    fontSize: "14px",
                    textTransform: "none",
                    "&:hover": {
                      background: "#445FD2",
                    },
                  }}
                  variant="contained"
                  onClick={uploadData}
                >
                  Go Live
                </Button>
              </Box>
            </BottomNavigation>
          </Box>
        </Box>
      </form>
    </>
  );
}
const Text = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 12,
  ml: "2%",
  mb: "1%",
  pt: "2%",
  // py: 1,
  color: "#6B7A99",
};

const MenuItemTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 14,
  color: "#6B7A99",
};

const CommonTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#6B7A99",
};

const MenuItems = {
  fontSize: "12px",
  color: "#6B7A99",
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
};
const GW = {
  width: "20%",
  ".MuiOutlinedInput-notchedOutline": { border: 0 },
  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: 0,
  },
  background: "#FFFFFF",
  height: "100%",
  color: "#6B7A99",
  fontSize: "12px",
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  borderRadius: "0px 10px 10px 0px",
};

const ToolTextStyle = {
  fontFamily: "Outfit",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "13px",
  color: "#fff",
  textAlign: "center",
  cursor: "pointer",
};
