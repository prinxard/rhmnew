import Widget from "../widget";
import { formatNumber } from "../../functions/numbers";
import * as Icons from '../Icons/index';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import url from '../../config/url';
import axios from "axios";
import setAuthToken from "../../functions/setAuthToken";
import { useRouter } from "next/router";
import Loader from "react-loader-spinner";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormatMoneyComponent } from "../FormInput/formInputs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SubmitButton } from "../CustomButton/CustomButton";
import { FiCheck } from 'react-icons/fi';
import SectionTitle from "../section-title";
import { set } from "nprogress";
import { data } from "autoprefixer";

export const StartBOJ = () => {

  const [payerDetails, setpayerDetails] = useState([]);
  const [isFetching, setIsFetching] = useState(() => false);
  const [isFetching2, setIsFetching2] = useState(() => false);
  const [bojErrors, setErrors] = useState(() => []);
  const [bojData, setBojData] = useState(() => []);
  const [employed, setEmployed] = useState('');
  const [self_employed, setSelfEmployed] = useState('');
  const [routerAssId, setAssessId] = useState('');
  const router = useRouter();


  //taxcal
  let tax;
  let tax_paid;

  ///TAX CAL
  let employedF = employed;
  let selfEmployedF = self_employed;

  // console.log(employedF, selfEmployedF);

  let consolidatedRelief;
  let chargeableIncome;
  let totalRelief;
  let totalDeduction;
  let consolidatedIncome

  useEffect(() => {
    if (router && router.query) {
      let routerData = String(router.query.ref);
      let kgtin = routerData.split(',').pop()
      let assessId = routerData.split(',').shift()
      setAssessId(assessId)
      let kgtinPost = {
        "KGTIN": `${kgtin}`
      }

      setAuthToken();
      const fetchPost = async () => {
        setIsFetching(true)
        try {
          let res = await axios.post(`${url.BASE_URL}taxpayer/view-individual`, kgtinPost);
          let IndData = res.data.body
          setpayerDetails(IndData)
          // console.log(IndData);
          setIsFetching(false);
        } catch (err) {
          console.log(err);
          setIsFetching(false);
        }
      };
      fetchPost();
    }
  }, [router]);

  useEffect(() => {
    if (router && router.query) {
      let routerData = String(router.query.ref);
      let kgtin = routerData.split(',').pop()
      let assessId = routerData.split(',').shift()
      // setAssessId(assessId)
      let fetchboj = {
        KGTIN: kgtin,
        assessment_id: assessId
      }

      setAuthToken();
      const bojPost = async () => {
        setIsFetching(true)
        try {
          let res = await axios.post(`${url.BASE_URL}forma/view-assessment`, fetchboj);
          let IndData = res.data.body.assessment
          setBojData(IndData)
          console.log(IndData);
          // setpayerDetails(IndData)
          // console.log(IndData);
          setIsFetching(false);
        } catch (err) {
          console.log(err);
          setIsFetching(false);
        }
      };
      bojPost();
    }
  }, [router]);

  // console.log("payer", payerDetails);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm()


  const watchAllFields = watch();;
  const emplFigure = watchAllFields.employment;
  const selfemplFigure = watchAllFields.self_employment;
  const otherIncomeFigure = watchAllFields.other_income

  const TotalIncome = (Number(emplFigure) + Number(selfemplFigure) + Number(otherIncomeFigure))

  setAuthToken();
  let CreatBOJ = async (data) => {
    setIsFetching(true)
    let BOJObject = {
      assessment_id: routerAssId,
      employed: data.employment,
      self_employed: data.self_employment,
      other_income: data.other_income,
      tax: JsonTax,
      previous_yr_tax: data.previous_tax,
      boj_comment: data.comment
    }
    try {
      let res = await axios.put(`${url.BASE_URL}forma/boj-assessment`, BOJObject);
      setIsFetching(false)
      toast.success("Success!");
      router.push('/view/completeddirect')
    } catch (error) {
      // toast.error("Failed!");
      // console.log(error);
      setIsFetching(false)
      if (error.response.status == 400) {
        // setUploadErrors(() => error.response.data.message);
        toast.error("BOJ Already Exist")
      } else {
        toast.error("Failed to create BOJ!");
      }
    }
  }

  setAuthToken();
  let UpdateBOJ = async (data) => {
    setIsFetching(true)
    let BOJObject = {
      assessment_id: routerAssId,
      employed: data.employment,
      self_employed: data.self_employment,
      tax: JsonTax,
      previous_yr_tax: data.previous_tax,
      boj_comment: data.comment,
      other_income: data.other_income
    }
    try {
      let res = await axios.put(`${url.BASE_URL}forma/boj-assessment`, BOJObject);
      setIsFetching(false)
      toast.success("Success!");
      router.push('/view/completeddirect')
    } catch (error) {
      // toast.error("Failed!");
      // console.log(error);
      setIsFetching(false)
      if (error.response.status == 400) {
        // setUploadErrors(() => error.response.data.message);
        toast.error("Nothing was updated")
      } else {
        toast.error("Failed to update BOJ!");
      }
    }
  }

  let CalTax = () => {
    setEmployed(emplFigure)
    setSelfEmployed(selfemplFigure)
  }


  consolidatedIncome = (Number(selfEmployedF) + Number(employedF));
  // console.log("Consl", consolidatedIncome);

  totalRelief = 0;
  let gross_inc = consolidatedIncome - totalRelief;

  // console.log(gross_inc, ' gross')


  if (consolidatedIncome < 360000.0) {
    consolidatedRelief = 0;
    //console.log(gross_inc);
  } else {
    consolidatedRelief = 200000 + 0.2 * gross_inc;
    // console.log("Gross INC", gross_inc);
  }

  totalDeduction = consolidatedRelief + totalRelief;
  chargeableIncome = consolidatedIncome - totalDeduction;

  //calculate tax
  if (consolidatedIncome <= 360000.0) {
    tax = consolidatedIncome * 0;

    //console.log(tax+' 1');
  } else if (consolidatedIncome > 360000 && chargeableIncome < 300000) {
    tax = (chargeableIncome * 0.07);
    let taxS = (consolidatedIncome * 0.01);
    if (tax > taxS) {
      tax = tax
    }
    else {
      tax = taxS;

    }
    //console.log(tax+' tax2');
  } else if (chargeableIncome > 300000 && chargeableIncome <= 600000) {
    tax = 300000 * 0.07 + (chargeableIncome - 300000) * 0.11;

    //console.log(tax+' tax3');
  } else if (chargeableIncome > 600000 && chargeableIncome <= 1100000) {
    tax = 300000 * 0.07 + 300000 * 0.11 + (chargeableIncome - 600000) * 0.15;

    //console.log(tax + ' 4');
  } else if (chargeableIncome > 1100000 && chargeableIncome <= 1600000) {
    tax =
      300000 * 0.07 +
      300000 * 0.11 +
      500000 * 0.15 +
      (chargeableIncome - 1100000) * 0.19;

    //console.log(tax + ' 5');
  } else if (chargeableIncome > 1600000 && chargeableIncome <= 3200000) {
    tax =
      300000 * 0.07 +
      300000 * 0.11 +
      500000 * 0.15 +
      500000 * 0.19 +
      (chargeableIncome - 1600000) * 0.21;

    //console.log(tax + ' 6');
  } else if (chargeableIncome > 3200000) {
    tax =
      300000 * 0.07 +
      300000 * 0.11 +
      500000 * 0.15 +
      500000 * 0.19 +
      1600000 * 0.21 +
      (chargeableIncome - 3200000) * 0.24;

    //console.log(tax + ' 7');
  }

  tax = tax.toFixed(2);
  // console.log(tax, ' 2')
  tax = parseInt(tax);
  tax_paid = tax;

  let JsonTax = String(tax_paid)

  // console.log(tax_paid);
  console.log("Obj", bojData);

  return (
    <>
      <ToastContainer />
      {isFetching && (
        <div className="flex justify-center item mb-2">
          <Loader
            visible={isFetching}
            type="BallTriangle"
            color="#00FA9A"
            height={19}
            width={19}
            timeout={0}
            className="ml-2"
          />
          <p className="font-bold">Processing...</p>
        </div>
      )}

      {bojData.boj_comment === null ?
        <div>
          <SectionTitle subtitle="BOJ Assessment" />
          {payerDetails.map((ind, i) => (


            <div className="border mb-3 block p-8 rounded-lg bg-white w-full">
              <div className="flex">
                <h6 className="p-2">Taxpayer Information</h6>
                {/* <a href="" className="text-blue-600 self-center">Edit</a> */}
              </div>
              <p className="mb-3 font-bold"></p>
              <form>
                <div className="grid grid-cols-3 gap-4">
                  <div className="">
                    <p>Surname</p>
                    <input readOnly defaultValue={ind.surname} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>

                  <div className="form-group mb-6">
                    <p>First Name</p>
                    <input readOnly defaultValue={ind.first_name} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>

                  <div className="form-group mb-6">
                    <p>Middle Name</p>
                    <input readOnly defaultValue={ind.middle_name} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group mb-6">
                    <p>Title</p>

                    <input readOnly defaultValue={ind.indv_title} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />

                  </div>

                  <div className="form-group mb-6">
                    <p>Date of Birth</p>

                    <input readOnly defaultValue={ind.birth_date} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />

                  </div>
                  <div className="form-group mb-6">
                    <p>Phone number</p>
                    <input readOnly defaultValue={ind.phone_number} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group mb-6">
                    <p>Tax Office</p>
                    <input readOnly defaultValue={ind.tax_office} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>

                  <div className="form-group mb-6">
                    <p>Email</p>
                    <input readOnly defaultValue={ind.email} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          ))}
          <form onSubmit={handleSubmit(CreatBOJ)}>

            <div className="flex justify border mb-3 block p-8 rounded-lg bg-white w-full">

              <div className="">

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label>Employment Income:</label>

                  <div>

                    <input ref={register()} name="employment" type="text" className="form-control w-full rounded"
                    />

                  </div>

                </div>

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label>Self Employment Income:</label>

                  <div>
                    <input ref={register()} name="self_employment" type="text" className="form-control w-full rounded"
                    />
                  </div>

                </div>

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label>Other Income:</label>
                  <div>
                    <input ref={register()} defaultValue={0} name="other_income" type="text" className="form-control w-full rounded"
                    />
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label>Tax Paid for previous year:</label>
                  <input name="previous_tax" ref={register({ required: "Previous year tax is required" })} type="text" className="form-control w-full rounded"
                  />
                  {errors.previous_tax && <small className="text-red-600">{errors.previous_tax.message}</small>}
                </div>

                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label htmlFor="employername">Tax to be paid:</label>

                  <div>
                    <div className="flex">
                      <button type="button" onClick={CalTax} style={{ backgroundColor: "#84abeb" }} className=" w-32 ml-3 btn text-white btn-outlined bg-transparent rounded-md">Show tax</button>
                      <h6 className="ml-3">{formatNumber(tax_paid)}</h6>
                    </div>
                  </div>

                </div>
                <div className="mb-6 grid grid-cols-3 gap-2">
                  <label>Reason for BOJ:</label>
                  <div>
                    <textarea ref={register({ required: "Reason for BOJ is required" })} name="comment" cols="34" rows="2" className="rounded"></textarea>
                  </div>
                  {errors.comment && <small className="text-red-600">{errors.comment.message}</small>}
                </div>
                <p className="font-bold">Total Income: <span className="font-bold">{formatNumber(TotalIncome)}</span> </p>
                <div className="flex justify-end mt-5">
                  <button
                    style={{ backgroundColor: "#84abeb" }}
                    className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                    type="submit"
                  >
                    Create Assessmnent
                  </button>
                </div>
              </div>

            </div>

          </form>

        </div>
        :

        <div>
          <SectionTitle subtitle="Update Assessment" />
          {payerDetails.map((ind, i) => (

            <div className="border mb-3 block p-8 rounded-lg bg-white w-full">
              <div className="flex">
                <h6 className="p-2">Taxpayer Information</h6>
                {/* <a href="" className="text-blue-600 self-center">Edit</a> */}
              </div>
              <p className="mb-3 font-bold"></p>
              <form>
                <div className="grid grid-cols-3 gap-4">
                  <div className="">
                    <p>Surname</p>
                    <input readOnly defaultValue={ind.surname} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>

                  <div className="form-group mb-6">
                    <p>First Name</p>
                    <input readOnly defaultValue={ind.first_name} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>

                  <div className="form-group mb-6">
                    <p>Middle Name</p>
                    <input readOnly defaultValue={ind.middle_name} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group mb-6">
                    <p>Title</p>

                    <input readOnly defaultValue={ind.indv_title} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />

                  </div>

                  <div className="form-group mb-6">
                    <p>Date of Birth</p>

                    <input readOnly defaultValue={ind.birth_date} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />

                  </div>
                  <div className="form-group mb-6">
                    <p>Phone number</p>
                    <input readOnly defaultValue={ind.phone_number} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group mb-6">
                    <p>Tax Office</p>
                    <input readOnly defaultValue={ind.tax_office} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>

                  <div className="form-group mb-6">
                    <p>Email</p>
                    <input readOnly defaultValue={ind.email} type="text" className="form-control w-full rounded font-light text-gray-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          ))}
          <form onSubmit={handleSubmit(UpdateBOJ)}>
            {bojData.map((ind, i) => (

              <div className="flex justify border mb-3 block p-8 rounded-lg bg-white w-full">

                <div className="">

                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <label>Employment Income:</label>

                    <div>

                      <input defaultValue={ind.employed} ref={register()} name="employment" type="text" className="form-control w-full rounded"
                      />

                    </div>

                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <label>Self Employment Income:</label>

                    <div>

                      <input defaultValue={ind.self_employed} ref={register()} name="self_employment" type="text" className="form-control w-full rounded"
                      />

                    </div>

                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <label>Other Income:</label>
                    <div>
                      <input defaultValue={ind.other_income} ref={register()} name="other_income" type="text" className="form-control w-full rounded"
                      />
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <label>Tax Paid for previous year:</label>
                    <input defaultValue={ind.previous_yr_tax} name="previous_tax" ref={register({ required: "Previous year tax is required" })} type="text" className="form-control w-full rounded"
                    />
                    {errors.previous_tax && <small className="text-red-600">{errors.previous_tax.message}</small>}
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <label htmlFor="employername">Tax to be paid:</label>

                    <div>
                      <div className="flex">
                        <button type="button" onClick={CalTax} style={{ backgroundColor: "#84abeb" }} className=" w-32 ml-3 btn text-white btn-outlined bg-transparent rounded-md">Show tax</button>
                        <h6 className="ml-3">{formatNumber(tax_paid)}</h6>
                      </div>
                    </div>

                  </div>
                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <label>Reason for BOJ:</label>
                    <div>
                      <textarea defaultValue={ind.boj_comment} ref={register({ required: "Reason for BOJ is required" })} name="comment" cols="34" rows="2" className="rounded"></textarea>
                    </div>
                    {errors.comment && <small className="text-red-600">{errors.comment.message}</small>}
                  </div>
                  <p className="font-bold">Total Income: <span className="font-bold">{formatNumber(TotalIncome)}</span> </p>
                  <div className="flex justify-end mt-5">
                    <button
                      style={{ backgroundColor: "#84abeb" }}
                      className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                      type="submit"
                    >
                      Update Assessmnent
                    </button>
                  </div>
                </div>

              </div>
            ))}

          </form>

        </div>
      }
    </>
  );
};









