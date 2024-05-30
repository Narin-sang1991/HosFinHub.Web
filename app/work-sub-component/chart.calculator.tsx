import { useAppSelector } from "@/store/hooks";
import { selectResult } from '@/store/work-ipd/workIpdSlice'
import React, { useEffect } from "react";


const ChartCalculator = () => {
    const workData = useAppSelector(selectResult)

    useEffect(()=>{
        
    },[workData])
    return (
        <React.Fragment>
            ChartCalculator
        </React.Fragment>
    )
}

export default ChartCalculator