import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {useFormikContext} from "formik";
import {useStore} from "../../stores";
import {observer} from "mobx-react-lite";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {Button, ButtonGroup, Collapse, Grid} from "@mui/material";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

function AccountCategoryFilter() {
    const {accountCategoryStore} = useStore();
    const {
        isOpenFilter,
        handleFilter,
        handleCloseFilter
    } = accountCategoryStore;

    function handleResetFilter() {
        const newSearchObject = {
            ...JSON.parse(JSON.stringify({})),
        };
        handleFilter(newSearchObject);
    }

    return (
        <Collapse in={isOpenFilter} className="filterPopup">
            <div className="flex flex-column">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <div className="filterContent pt-8">
                            <Grid container spacing={2} className={"flex flex-end"}>
                            </Grid>
                            <div className="py-8 mt-12 border-bottom-fade border-top-fade">
                                <div className="flex justify-end">
                                    <ButtonGroup
                                        color="container"
                                        aria-label="outlined primary button group"
                                    >
                                        <Button
                                            onClick={handleResetFilter}
                                            startIcon={<RotateLeftIcon/>}
                                        >
                                            Đặt lại
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleCloseFilter}
                                            startIcon={<HighlightOffIcon/>}
                                        >
                                            Đóng bộ lọc
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </Collapse>
    );
}

export default memo(observer(AccountCategoryFilter));