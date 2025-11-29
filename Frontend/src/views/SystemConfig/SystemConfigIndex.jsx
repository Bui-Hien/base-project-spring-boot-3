import {memo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {observer} from "mobx-react-lite";
import {useStore} from "../../stores";
import SystemConfigForm from "./SystemConfigForm";
import CommonBreadcrumb from "../../common/CommonBreadcrumb";
import SystemConfigList from "./SystemConfigList";
import SystemConfigToolbar from "./SystemConfigToolbar";

function SystemConfigIndex() {
    const {systemConfigStore} = useStore();
    const {t} = useTranslation();

    const {
        openCreateEditPopup,
        pagingSystemConfig,
        resetStore
    } = systemConfigStore;

    useEffect(() => {
        pagingSystemConfig()
        return resetStore
    }, []);
    return (
        <div className="content-index">
            <div className="">
                <CommonBreadcrumb routeSegments={[
                    {name: t("navigation.admin.title")},
                    {name: t("navigation.admin.systemConfig")}
                ]}/>
            </div>
            <div className="index-card grid grid-cols-12 px-4">
                <div className={"col-span-12"}>
                    <SystemConfigToolbar/>
                </div>

                <div className={"col-span-12"}>
                    <SystemConfigList/>
                </div>
            </div>

            {openCreateEditPopup && (
                <SystemConfigForm/>
            )}
        </div>
    );
}

export default memo(observer(SystemConfigIndex));
