import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";
import ConstantList from "../appConfig";
import { NavLink } from "react-router-dom";

const CommonBreadcrumb = ({routeSegments, noRight}) => {
  const {t} = useTranslation ();

  return (
      <div
          className="flex items-center justify-between bg-gradient-to-r from-slate-100 to-slate-200 shadow-sm py-3 px-6   "
      >

        {/* === Title Section === */}
        <div className="flex items-center text-2xl font-bold text-slate-800 tracking-tight font-sans">
          {!noRight && routeSegments? (
              <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                    {routeSegments[routeSegments.length - 1]["subName"]? routeSegments[routeSegments.length - 1]["subName"]
                        : routeSegments[routeSegments.length - 1]["name"]}
                    </span>
          ) : (
              <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                      {t ("navigation.home")}
                    </span>
          )}
        </div>

        {/* === Breadcrumb Path === */}
        <div className="flex items-center text-sm text-slate-600">
          <NavLink
              to={ConstantList.ROOT_PATH}
              className="hover:text-primary-600 font-medium transition-colors"
          >
            {t ("navigation.home")}
          </NavLink>

          {routeSegments?.map ((route, index) => (<Fragment key={index}>
            <span className="mx-2 text-slate-400">›</span>
            <span
                className={`${route.subName? "text-primary-600 font-semibold" : "text-slate-600"}`}
            >
              {route.name}
            </span>

            {route.subName && (<>
              <span className="mx-2 text-slate-400">/</span>
              <span className="text-slate-500 font-medium">{route.subName}</span>
            </>)}
          </Fragment>))}
        </div>
      </div>
  );
};

export default CommonBreadcrumb;
