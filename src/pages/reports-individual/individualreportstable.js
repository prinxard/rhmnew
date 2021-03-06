import MaterialTable from "material-table";
import Search from '@material-ui/icons/Search'
import * as Icons from '../../components/Icons/index';
import { Delete, Edit, MoreHoriz } from "@material-ui/icons";
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
import { useRouter } from "next/router";
import { shallowEqual, useSelector } from "react-redux";
import jwt from "jsonwebtoken";


const fields = [
    // {
    //     title: "SN",
    //     field: "serialNo",
    //     filtering: false,
    //     width: "10%"
    // },
    {
        title: "KGTIN",
        field: "KGTIN",

    },
    {
        title: "First Name",
        field: "first_name",
    },
    {
        title: "Last Name",
        field: "surname",
    },
    {
        title: "Tax office",
        field: "tax_office",
    },
    {
        title: "Phone",
        field: "phone_number",
    },
    {
        title: "Create Time",
        field: "createtime",
        type: "date",
    },
];




export default function IndividualReportstable({ FilteredData }) {
    const router = useRouter();

    let items = FilteredData

    const { config, palettes, auth } = useSelector(
        (state) => ({
            config: state.config,
            palettes: state.palettes,
            auth: state.authentication.auth,
        }),
        shallowEqual
    );

    const reportRange = [39]
    const decoded = jwt.decode(auth);
    const userGroup = decoded.groups


    return (
        <>
            <MaterialTable title="Individual Taxpayer Data"
                data={items}
                columns={fields}
                actions={[

                    {
                        icon: MoreHoriz,
                        tooltip: 'View Profile',
                        onClick: (event, rowData) => router.push(`/payer-profile/${rowData.KGTIN}`)
                    },
                    {
                        icon: Edit,
                        tooltip: 'Edit Payer',
                        onClick: (event, rowData) => router.push(`/update-individual/${rowData.KGTIN}`)
                    }
                ]}
                options={{
                    search: true,
                    paging: true,
                    filtering: true,
                    actionsColumnIndex: -1,
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
                    Edit: Edit,
                    MoreHoriz: MoreHoriz,
                    FirstPage: FirstPage,
                    LastPage: LastPage,
                    NextPage: ChevronRight,
                    PreviousPage: ChevronLeft,
                    Search: Search,
                    ThirdStateCheck: Remove,
                    Clear: Clear,
                    SortArrow: ArrowDownward
                }}
            />

        </>
    )
}
