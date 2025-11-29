import React, {memo, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import {observer} from "mobx-react-lite";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function TabAccordion({children, title, component, className = "", open = true, handleOnClick}) {
    const [expanded, setExpanded] = useState(open);

    return (
        <Accordion
            component="section"
            expanded={expanded}
            onChange={(_, value) => {
                setExpanded(value);
                if (handleOnClick) handleOnClick(value);
            }}
            className={`${className} !rounded-lg border-[#c9dce8]`}
        >
            <AccordionSummary className={`px-4 py-3 !min-h-[50px] ${expanded && "!bg-[#f1f8fd] !border-[1px] !border-solid !rounded-lg"} !border-[#c9dce8]`}>
                <Typography className={` flex items-center gap-2 text-[#508dc1] !font-medium`}>
                    <ChevronRightIcon
                        className={`transition-transform duration-300 ${expanded ? 'rotate-90' : 'rotate-0'}`}
                    />
                    {title}
                </Typography>
            </AccordionSummary>

            <AccordionDetails className="p-8">
                {children || component || null}
            </AccordionDetails>
        </Accordion>
    );
}

export default memo(observer(TabAccordion));
