function createUrl(qs) {
    let base = "https://connect.mono.co/?";
    const valid = validate(qs);
    if (valid) {
        Object.keys(qs).map(function (k) {
            if (qs[k]) {
                const value = typeof (qs[k]) === "object" ? JSON.stringify(removeCircularReferences(qs[k])) : qs[k];
                function removeCircularReferences(obj) {
                    const seen = new WeakSet();
                    return JSON.parse(JSON.stringify(obj, (key, value) => {
                        if (typeof value === 'object' && value !== null) {
                            if (seen.has(value)) {
                                return; // Remove circular reference
                            }
                            seen.add(value);
                        }
                        return value;
                    }));
                }
                base = base.concat(`${k}=${value}&`);
            }
        });
        return base.slice(0, -1);
    }
    throw new Error("Invalid config object");
}
function validate(config) {
    switch (config.scope) {
        case "payments":
            return validatePaymentsData(config.data);
        default:
            return true;
    }
}
function validatePaymentsData(data) {
    data = Object.assign({ payment_id: undefined }, data);
    const requiredFields = ["payment_id"];
    for (let param in data) {
        if (requiredFields.includes(param)) {
            checkRequiredParam(param, data[param]);
        }
    }
    return true;
}
function checkRequiredParam(name, value) {
    if (!value) {
        throw new Error(`${name} is required!`);
    }
}
export { createUrl };
