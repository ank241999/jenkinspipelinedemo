export class ReportConstants {
    //Colors
    public static get color1(): any {
        return {
            "backgroundColor": "rgba(117, 123, 137, .2)",
            "borderColor": "rgba(117, 123, 137, 1)",
            "pointBackgroundColor": "rgba(117, 123, 137, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(117, 123, 137, .8)"
        };
    }
    public static get color2(): any {
        return {
            "backgroundColor": "rgba(11, 17, 113, .2)",
            "borderColor": "rgba(11, 17, 113, 1)",
            "pointBackgroundColor": "rgba(11, 17, 113, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(11, 17, 113, 1)"
        };
    }

    public static get color3(): any {
        return {
            "backgroundColor": "rgba(19, 56, 189, .2)",
            "borderColor": "rgba(19, 56, 189, 1)",
            "pointBackgroundColor": "rgba(19, 56, 189, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(19, 56, 189, .8)"
        };
    }

    public static get color4(): any {
        return {
            "backgroundColor": "rgba(1, 45, 54, .2)",
            "borderColor": "rgba(1, 45, 54, 1)",
            "pointBackgroundColor": "rgba(1, 45, 54, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(1, 45, 54, .8)"
        };
    }

    public static get color5(): any {
        return {
            "backgroundColor": "rgba(22, 32, 166, .2)",
            "borderColor": "rgba(22, 32, 166, 1)",
            "pointBackgroundColor": "rgba(22, 32, 166, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(22, 32, 166, .8)"
        };
    }

    public static get color6(): any {
        return {
            "backgroundColor": "rgba(39, 50, 194, .2)",
            "borderColor": "rgba(39, 50, 194, 1)",
            "pointBackgroundColor": "rgba(39, 50, 194, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(39, 50, 194, .8)"
        };
    }

    public static get color7(): any {
        return {
            "backgroundColor": "rgba(89, 120, 141, .2)",
            "borderColor": "rgba(89, 120, 141, 1)",
            "pointBackgroundColor": "rgba(89, 120, 141, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(89, 120, 141, .8)"
        };
    }

    public static get color8(): any {
        return {
            "backgroundColor": "rgba(36, 21, 112, .2)",
            "borderColor": "rgba(36, 21, 112, 1)",
            "pointBackgroundColor": "rgba(36, 21, 112, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(36, 21, 112, .8)"
        };
    }

    public static get color9(): any {
        return {
            "backgroundColor": "rgba(6, 16, 148, .2)",
            "borderColor": "rgba(6, 16, 148, 1)",
            "pointBackgroundColor": "rgba(6, 16, 148, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(6, 16, 148, .8)"
        };
    }

    public static get color10(): any {
        return {
            "backgroundColor": "rgba(127, 238, 255, .2)",
            "borderColor": "rgba(127, 238, 255, 1)",
            "pointBackgroundColor": "rgba(127, 238, 255, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(127, 238, 255, .8)"
        };
    }

    public static get color11(): any {
        return {
            "backgroundColor": "rgba(58, 67, 186, .2)",
            "borderColor": "rgba(58, 67, 186, 1)",
            "pointBackgroundColor": "rgba(58, 67, 186, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(58, 67, 186, .8)"
        };
    }

    public static get color12(): any {
        return {
            "backgroundColor": "rgba(99, 198, 221, .2)",
            "borderColor": "rgba(99, 198, 221, 1)",
            "pointBackgroundColor": "rgba(99, 198, 221, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(99, 198, 221, .8)"
        };
    }

    public static get color13(): any {
        return {
            "backgroundColor": "rgba(41, 31, 94, .2)",
            "borderColor": "rgba(41, 31, 94, 1)",
            "pointBackgroundColor": "rgba(41, 31, 94, 1)",
            "pointBorderColor": "#fff",
            "pointHoverBackgroundColor": "#fff",
            "pointHoverBorderColor": "rgba(41, 31, 94, .8)"
        };
    }

    public static get reportDataDefault(): any {
        return [{ "data": [0], "label": "" }];
    }

    public static get reportDataDatewiseDefault(): any {
        return [{ "data": [0], "label": "" }];
    }

    public static get lineChartLabels(): any {
        // return ["Handgun", "Rifle", "Pipe bomb", "Anomaly", "Cellphone", "Keys"];
        return ["Handgun", "Rifle", "Pipe bomb", "Knife", "Threat", "Anomaly"];
    }

    public static get throughputChartLabels(): any {
        // return ["Handgun", "Rifle", "Pipe bomb", "Anomaly", "Cellphone", "Keys"];
        return ["Scanned"];
    }

    public static get doughNutChartColors(): any {
        return [{
            "backgroundColor": ["#757B89", "#0B1171", "#1338BD", "#012D36", "#1620A6"]
        }];
    }

    public static get monthNames(): any {
        return ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
    }

    public static get reportThroughput(): any {
        return [{ "data": [0], "label": "" }];
    }
}