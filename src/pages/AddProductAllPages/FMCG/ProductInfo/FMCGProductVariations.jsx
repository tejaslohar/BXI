import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import bxitoken from "../../../../assets/Images/CommonImages/BXIToken.svg";

export default function TextileProductInform(props) {
  const [currency, setCurrency] = useState({
    currencyType: "",
    amount: "",
    reasonOfCost: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(
      z.object({
        CostPrice: z.string().min(1),
        AdCostGST: z.coerce.number().lte(28,"GST must be less than or equal to 28").gt(0 , "GST must be greater than 0"),
        ReasonOfCost: z.string().min(1),
        currencyType: z.any(),
      })
    ),
  });
  console.log("errors from inside =====>", errors);

  useEffect(() => {
    if (props.defaultValue == null) {
      return;
    }
    for (const [key, value] of Object.entries(props.defaultValue)) {
      setValue(key, value);
    }
  }, [props.defaultValue]);

  return (
    <Box
      sx={{
        mt: 3,
        height: "auto",
        minHeight: "100px",
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: "10px",
        py: 2,
      }}
    >
      <Box
        sx={{
          py: "20px",
          display: "flex",
          gap: "20px",
          position: "relative",
          width: "100%",
          justifyContent: "space-between",
        }}
      >

        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "45px",
              mt: "1%",
              borderRadius: "10px",
            }}
          >
            <Typography sx={{ ...CommonTextStyle, pb: "20px" }}>
              Other cost if applicable
            </Typography>
            <Box
              sx={{
                display: "flex",
                background: "#FFFFFF",
                borderRadius: "10px",
                width: "100%",
                alignItems: "center",
              }}
            >
              <TextField
                {...register("CostPrice", {
                  onChange: (event) => {
                    event.target.value = parseInt(
                      event.target.value.replace(/[^\d]+/gi, "") || 0
                    ).toLocaleString("en-US");
                  },
                })}
                onKeyDown={(e) => {
                  if (e.key === " " && e.target.selectionStart === 0) {
                    e.preventDefault();
                  }
                }}
                placeholder="100"
                id="standard-basic"
                variant="standard"
                InputProps={{
                  disableUnderline: "true",
                  style: {
                    color: "#445FD2",
                    fontSize: "14px",
                    padding: "10px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "red",
                  },
                }}
                sx={{
                  width: "65%",
                  height: "100%",
                  background: "#FFFFFF",
                  borderRadius: "10px",
                  color: "#445FD2",
                }}
              />

              <Select
                defaultValue={"₹"}
                {...register("currencyType")}
                sx={{
                  width: "auto",
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                  "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                    {
                      border: 0,
                    },
                  "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
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
                }}
              >
                <MenuItem value="BXITokens">
                  <Box
                    component="img"
                    src={bxitoken}
                    alt="bxitoken"
                    sx={{
                      height: "15px",
                      width: "auto",
                    }}
                  />
                </MenuItem>

                <MenuItem value="₹">₹</MenuItem>
              </Select>
              {/* <Typography sx={{ color: "red" }}>
                {errors["currencyType"]?.message}
              </Typography> */}
            </Box>
            <Typography sx={{ color: "red" }}>
              {errors["CostPrice"]?.message}
            </Typography>
            <Typography sx={{ color: "red" , width: "maxContent"  }}>
            {errors["AdCostGST"]?.message}
          </Typography>
          </Box>
        </Box>

        <Box
        sx={{
          width: "10%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "45px",
            mt: "1%",
            borderRadius: "10px",
          }}
        >
          <Typography sx={{ ...CommonTextStyle, pb: "20px" }}>
            GST
          </Typography>
          <Box
            sx={{
              display: "flex",
              background: "#FFFFFF",
              borderRadius: "10px",
              width: "100%",
              alignItems: "center",
            }}
          >
            <TextField
              // {...register("CostPrice")}
              {...register("AdCostGST", {
                onChange: (event) => {
                  event.target.value = parseInt(
                    event.target.value.replace(/[^\d]+/gi, "") || 0
                  ).toLocaleString("en-US");
                },
              })}
              type="number"
              placeholder="10"
              id="standard-basic"
              variant="standard"
              InputProps={{
                disableUnderline: "true",
                style: {
                  color: "#445FD2",
                  fontSize: "14px",
                  padding: "10px",
                },
              }}
              InputLabelProps={{
                style: {
                  color: "red",
                },
              }}
              sx={{
                width: "65%",
                height: "100%",
                background: "#FFFFFF",
                borderRadius: "10px",
              }}
            />
          </Box>

        </Box>
      </Box>



        
        <Box
        sx={{
          display: "flex",
          gap: "20px",
          position: "relative",
          width: "50%"
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "45px",
            mt: "1%",
            borderRadius: "10px",
            pb: "5px",
          }}
        >
          <Typography sx={{...CommonTextStyle, pb: "20px"}}>
          Reason of cost
          </Typography>
          <Box
            sx={{
              display: "flex",
              background: "#fff",
              borderRadius: "10px",
            
            }}
          >
            <TextField
            
            {...register("ReasonOfCost")}
            placeholder="Eg. Every 3 minutes in loop"
            id="standard-basic"
            variant="standard"
            InputProps={{
              disableUnderline: "true",
              style: {
                // color: "rgba(107, 122, 153)",
                fontSize: "14px",
                padding: "10px",
                color: "#445fd2",
              },
            }}
            InputLabelProps={{
              style: {
                color: "red",
              },
            }}
            sx={{
              width: "100%",
              height: "53px",
              background: "#FFFFFF",
              borderRadius: "10px",
              color: "#445fd2",
            }}
            />
            <Button
              sx={{
                color: "#6B7A99",
                // position: "absolute",
                right: 0,
                textTransform: "none",
                fontSize: "12px",
                // height: "42px",
                border: "1px solid #445FD2",
                alignSelf: "center",
                "&:hover": {
                  border: "none",
                },
              }}
              onClick={async () => {
                if ((await trigger()) === false) {
                  console.log(errors, "errors=====>");
                  return;
                }
                props.append(getValues(), props.index);
                reset({
                  CostPrice: "",
                  ReasonOfCost: "",
                });
              }}
            >
              Add
            </Button>
          </Box>
          <Typography sx={{ color: "red" , width: "maxContent"  }}>
          {errors["ReasonOfCost"]?.message}
        </Typography>
        </Box>
      </Box>

      </Box>
    </Box>
  );
}

const CommonTextStyle = {
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: "21px",
  color: "#6B7A99",
};
