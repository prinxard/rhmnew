import MaterialTable from "material-table";
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'
import SaveAlt from '@material-ui/icons/SaveAlt'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Add from '@material-ui/icons/Add'
import Check from '@material-ui/icons/Check'
import FilterList from '@material-ui/icons/FilterList'
import Remove from '@material-ui/icons/Remove'
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Clear from "@material-ui/icons/Clear";
import * as Icons from '../../components/Icons/index';
import { useRouter } from "next/router";
import { useEffect } from "react";

const fields = [
    // {
    //     title: "SN",
    //     field: "serialNo",
    //     filtering: false,
    //     width: "10%"
    // },
    {
        title: "Name",
        field: "taxpayerName",
    },
    {
        title: "Taxpayer ID",
        field: "t_payer",
    },
    {
        title: "Assessment ID",
        field: "assessment_id",
    },
    {
        title: "MDA",
        field: "mda",
    },
    {
        title: "Revenue Item",
        field: "revenueItem",
    },
    {
        title: "File ref",
        field: "ref",
    },
    {
        title: "Bank",
        field: "bank",
    },
    {
        title: "Channel",
        field: "channel_id",
    },
    {
        title: "Amount",
        field: "amount",
    },

    {
        title: "Station",
        field: "station",
    },
    {
        title: "Transaction Date",
        field: "tran_date",
    },
];

const data = [
    // {
    //     title: "SN",
    //     field: "serialNo",
    //     filtering: false,
    //     width: "10%"
    // },
    {
        tran_date: "Taxpayer ID",
    },
    {
        tran_date: "Name",
    },
    {
        mda: "MDA",
        field: "mda",
    },
    {
        amount: "Revenue Item",
        field: "revenueItem",
    },
    {
        title: "File ref",
        field: "ref",
    },
    {
        title: "Bank",
        field: "bank",
    },
    {
        title: "Channel",
        field: "channel_id",
    },
    {
        title: "Amount",
        field: "amount",
    },

    {
        title: "Station",
        field: "station",
    },
    {
        title: "Transaction Date",
        field: "tran_date",
    },
];


export default function Reportstable({ FilteredData }) {
    const router = useRouter();

    let items = FilteredData

    useEffect(() => {

    }, [router.query]);

    console.log("datainchild", FilteredData);

    return (
        <>
            <MaterialTable title="Report Data"
                data={items}
                columns={fields}

                options={{
                    search: true,
                    paging: true,
                    filtering: true,
                    // rowStyle: (rowData) => {
                    //     if (rowData.status === "Printed") {
                    //         return {
                    //             color: "#5f9f45",
                    //             backgroundColor: "#156448",
                    //         }
                    //     } else {
                    //         return {};
                    //     }
                    // },
                    exportButton: {
                        csv: true,
                        pdf: false
                    },
                    exportAllData: true,

                }}
                icons={{
                    Check: Check,
                    DetailPanel: ChevronRight,
                    Export: SaveAlt,
                    Filter: () => <Icons.Filter />,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    Clear: Clear,
                    SortArrow: ArrowDownward
                }}

            // onRowClick={(event, rowData) => {

            //     if (userGroup.some(r => reportRange.includes(r))) {
            //         ''

            //     }

            //     else {
            //         window.open(`/view/listprinttcc/${rowData.id}`, "_self")
            //         event.stopPropagation();
            //     }
            // }}
            />

        </>
    )
}