const SerializeCriteria = ({ criteria, defaultIndex = 0, defaultPaging = 20, defaultSorting }: {
    criteria: any,
    defaultIndex?: number,
    defaultPaging?: number,
    defaultSorting: any
}): any => {
    let newCriteria: any = {
        "Criteria": SerializeCondition({ criteria }),
        "PagingCriteria": SerializePaging({ criteria, defaultIndex, defaultPaging }),
        "SortingCriteria": [
            {
                "Name": (criteria && criteria.sorting) ? criteria.sorting : defaultSorting,
                "Direction": (criteria && criteria.sortMode) ? criteria.sortMode : 0
            }
        ]
    }
    // console.log("newCriteria==>", newCriteria);
    return newCriteria;
}

const SerializeCondition = ({ criteria }: { criteria: any }): any => {
    // console.log("criteria1===>", criteria);
    var arrCriteria: any[] = [];
    for (var key in { ...criteria }) {
        if (key !== 'indexOffset' && key !== 'paging' && key !== 'sorting' && key !== 'sortMode')
            arrCriteria.push({ key: key, value: criteria[key] });
    }
    // console.log("arrCriteria===>", arrCriteria);
    let newCriteria: any = {};
    arrCriteria.forEach((obj) => {
        Object.assign(newCriteria, { [obj.key]: (obj.value !== undefined ? obj.value : null), });
    });
    // console.log("newCriteria===>", newCriteria);
    return newCriteria;
}

const SerializePaging = ({ criteria, defaultIndex, defaultPaging }: {
    criteria: any,
    defaultIndex: number,
    defaultPaging: number
}): any => {
    // console.log("criteria2===>", criteria);
    let newPaging: any = {
        "PageIndex": (criteria && criteria.indexOffset) ?
            (criteria.indexOffset === 0 ? criteria.indexOffset : criteria.indexOffset - 1)
            : defaultIndex,
        "PageSize": criteria && criteria.paging !== undefined && criteria.paging != null
            ? criteria.paging
            : defaultPaging
    }
    // console.log("newPaging===>", newPaging);
    return newPaging;
}

export { SerializeCriteria, SerializeCondition, SerializePaging }

