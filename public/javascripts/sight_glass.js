var elemCount = 0;

//Chart.defaults.global.scaleFontSize = 14;

var modaldiv = document.createElement('div');
modaldiv.style.height = "800px";
modaldiv.style.width = "600px";

function getNextId(){
    return elemCount++;
}

var defaultData = {};

var SGPage = {
    WidgetArray: null,
    Add: function(widget, elementId){
        
    },
    Delete: function(widget, elementId){
        
    },
    RenderPage: function(widgetArray, elementId){
        this.Clear(elementId);
        this.WidgetArray = widgetArray;
        for(var i=0;i<widgetArray.length;i++){
            var container = Object.create(SGWidgetContainer);
            container.Initialize(widgetArray[i],elementId);
        }
    },
    Clear: function(elementId){
        removeAllChildren(elementId);
        WidgetArray = null;
    }
}

var SGWidgetContainer =  {
    Configuration: null,
    Initialize: function (config, elementId) {
        Configuration = config;
        var plotmain = document.getElementById(elementId);
        var widget = document.createElement('div');
        widget.style.height = config.Height + "px";
        widget.style.width = config.Width + "px";
        widget.style.left = config.Left + "px";
        widget.style.top = config.Top + "px";
        widget.style.position = "absolute";
        widget.className += " draggable sightglass-widget-box";
        var widgetheader = document.createElement('div');
        widgetheader.style.height = "50px";
        widgetheader.style.width = "100%";
        widgetheader.className += " row";
        var editbtn = document.createElement('div');
        editbtn.className += " pull-right widget-toolbar-button";
        editbtn.innerHTML = '<i class="fa fa-wrench fa-lg"  title="Edit"></i>';
        var refreshbtn = document.createElement('div');
        refreshbtn.className += " pull-right widget-toolbar-button";
        refreshbtn.innerHTML = '<i class="fa fa-refresh fa-lg" title="Refresh"></i>';
        var removebtn = document.createElement('div');
        removebtn.className += " pull-right widget-toolbar-button";
        removebtn.innerHTML = '<i class="fa fa-times fa-lg" title="Delete"></i>';
        
        widgetheader.appendChild(editbtn);
        widgetheader.appendChild(refreshbtn);
        widgetheader.appendChild(removebtn);
        var nextid = getNextId();
        var contentid = "widget_content_" + nextid;
        var titlediv = document.createElement('div');
        titlediv.className += " pull-left sightglass-widget-title";
        titlediv.id = contentid + "_title";
        widgetheader.appendChild(titlediv);
        widget.appendChild(widgetheader);
        var widgetcontent = document.createElement('div');
        widgetcontent.className += " sightglass-widget-content row";
        widgetcontent.style.height = "90%";
        widgetcontent.id = contentid;
        widget.appendChild(widgetcontent);
        plotmain.appendChild(widget);
        config.Render(contentid);
        editbtn.onclick = function(){config.Edit();};
        refreshbtn.onclick = function(){config.Refresh();};
        removebtn.onclick = function(){plotmain.removeChild(widget);};
        $(".draggable").draggable().resizable();
    },
    Edit: function(config){
        var element = document.getElementById('editorholder');
        var editor = new JSONEditor(element, {theme: 'bootstrap3', schema: config.Schema});
        $('#editormodal').modal({
              keyboard: true
            })
    }
}

var SparseChart = {
    Name: "SparseChart",
    Title: "Chart for small data",
    Top: 0,
    Left: 0,
    Height: 250,
    Width: 500,
    DOMElementId: null,
    DataURL: null,
    LabelExpression: null,
    ValueExpression: null,
    ChartType: "Radar",
    Schema: {
          type: "object",
          title: "SparseChart",
          "options": {
                disable_collapse: true,
                disable_properties: true,
              },
          properties: {
            Title: {
              type: "string",
            },
            ChartType:{
                type: "string",
                defaultValue: "Bar", 
                 enum: [
                "Bar",
                "Donut",
                "Line",
                "Pie",
                "Radar"
              ]
            },
            DataURL: {type: "string"},
            LabelExpression: {type: "string"},
            ValueExpression: {type: "string",},
            /*DataSettings:{
                type: "array",
                format: "table",
                items: {
                    type: "object",
                    title: "DataSet",
                    properties: {
                            DataURL: {type: "string",},
                            LabelExpression: {type: "string",},
                            ValueExpression:{"type": "string"},
                            }
                        }
                    }*/
          }},
    DataPostProcessor: function(rawdata, config){
         var defaultdata = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "#f58000",
                    strokeColor: "#f58000",
                    pointColor: "#f58000",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
               /* {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,1)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }*/
            ]
        };
        if(null===rawdata)
        {
            return defaultdata;
        }
        
        var lbl_exp = config.LabelExpression;
        var val_exp = config.ValueExpression;
        var extractedlabels = JSONPath({json: rawdata, path: lbl_exp});
        var extracteddata = JSONPath({json: rawdata, path: val_exp});
        var data = null;
        if(config.ChartType==="Bar" || config.ChartType==="Radar" || config.ChartType==="Line")
        {
            data = {
                labels: extractedlabels,
                datasets: [
                    {
                        label: "DataSet",
                        fillColor: "#f58000",
                        strokeColor: "#f58000",
                        pointColor: "#f58000",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: extracteddata
                    }
                ]
            };
           
        }
        else{
            data = [];
            var palette = ["#efc015", "#d30a87", "#f3e4e4", "#0195d7", "#953900", "#aa0000", "#ff6600", "#44aa00", "#712174", "#cb2c31", "#e69598", "#c4e6ff", "#21759b", "#d54e21", "#464646", "#f7f7f7", "#ec2337", "#a51826", "#ffea1c", "#fff276"];
            var count = 0;
            for(var i=0; i < extractedlabels.length; i++){
                var data_el = {};
                data_el.label = extractedlabels[i];
                data_el.value = extracteddata[i];
                var paletteIndex = i%(palette.length - 1);
                data_el.color = palette[paletteIndex];
                data_el.highlight = palette[palette.length - 1 - paletteIndex];
                data.push(data_el);
            }
        }
         return data;
    },
    
    Render: function(elementId){
        var titlediv = document.getElementById(elementId + "_title");
        titlediv.innerHTML = "<span>" + this.Title + "</span>";
        this.DOMElementId = elementId;
        var widgetcontent = document.getElementById(elementId);
        var chartcanvas = document.createElement('canvas');
        var canvasid = elementId + "_canvas";
        chartcanvas.id = canvasid;
        widgetcontent.appendChild(chartcanvas);
        var ctx = document.getElementById(canvasid).getContext("2d");
        var chartdata = null;
        var processor = this.DataPostProcessor;
        var dataurl = this.DataURL;
        var config = this;
       /* var deferreds = [];
        for(var setting in this.DataSettings){
            deferreds.push(updateAjaxData(setting.DataURL,postprocessor,chartdata));
        }
        $.when.apply(null, deferreds).done(function() {
                ctx.canvas.width = widgetcontent.clientWidth - 100;
                ctx.canvas.height = widgetcontent.clientHeight - 50;
                var chart = new Chart(ctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
        });*/
        if(null===this.DataURL){
            chartdata = processor(null, this);
                ctx.canvas.width = widgetcontent.clientWidth - 100;
                ctx.canvas.height = widgetcontent.clientHeight - 50;
                var chart = new Chart(ctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
        }
        else{
        $.ajax({
            url: dataurl //"http://api.nal.usda.gov/ndb/reports/?ndbno=01009&type=f&format=json&api_key=DEMO_KEY",
        })
            .done(function (data) {
                chartdata = processor(data, config);
                ctx.canvas.width = widgetcontent.clientWidth - 100;
                ctx.canvas.height = widgetcontent.clientHeight - 50;
                switch (config.ChartType) {
                    case 'Bar':
                         var chart = new Chart(ctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Pie':
                        chart = new Chart(ctx).Pie(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Donut':
                        chart = new Chart(ctx).Doughnut(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Radar':
                        chart = new Chart(ctx).Radar(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Line':
                        chart = new Chart(ctx).Line(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    default:
                        chart = new Chart(ctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                        // code
                }
                //var chart = new Chart(ctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
            });
        }
       
    },
    Refresh: function(){
        var titlediv = document.getElementById(this.DOMElementId + "_title");
        titlediv.innerHTML = "<span>" + this.Title + "</span>";
        var content_el = document.getElementById(this.DOMElementId);
        var canvas_el = document.getElementById(this.DOMElementId + "_canvas");
        content_el.removeChild(canvas_el);
        var chartcanvas = document.createElement('canvas');
        var canvasid = this.DOMElementId + "_canvas";
        chartcanvas.id = canvasid;
        content_el.appendChild(chartcanvas);
        var chartdata = null;
        var config = this;
        var dataurl = this.DataURL;
        var processor = this.DataPostProcessor;
        $.ajax({
            url: dataurl //"http://api.nal.usda.gov/ndb/reports/?ndbno=01009&type=f&format=json&api_key=DEMO_KEY",
        })
            .done(function (data) {
                chartdata = processor(data, config);
                var nctx = document.getElementById(canvasid).getContext("2d");
                nctx.canvas.width = content_el.clientWidth - 100;
                nctx.canvas.height = content_el.clientHeight -50;
                switch (config.ChartType) {
                    case 'Bar':
                         var nchart = new Chart(nctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Pie':
                        nchart = new Chart(nctx).Pie(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Donut':
                        nchart = new Chart(nctx).Doughnut(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Radar':
                        nchart = new Chart(nctx).Radar(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    case 'Line':
                        nchart = new Chart(nctx).Line(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                    default:
                        nchart = new Chart(nctx).Bar(chartdata, { responsive: true, maintainAspectRatio: false });
                        break;
                        // code
                }
            });
        
    },
     Edit: function(){
        removeAllChildren('editorholder');
        var element = document.getElementById('editorholder');
        var editor = new JSONEditor(element, {theme: 'bootstrap3',iconlib: "fontawesome4", schema: this.Schema, startval: {Title:this.Title, ChartType:this.ChartType, DataURL: this.DataURL, LabelExpression: this.LabelExpression, ValueExpression: this.ValueExpression}});
        $('#editormodal').modal({keyboard: true});
        var target = this;
        var btn = document.getElementById('editorsave');
        btn.onclick = function()
            {
                var editedconfig = editor.getValue();
                if(null!==editedconfig){
                    target.Title = editedconfig.Title;
                    target.DataURL = editedconfig.DataURL;
                    target.ChartType = editedconfig.ChartType;
                    target.LabelExpression = editedconfig.LabelExpression;
                    target.ValueExpression = editedconfig.ValueExpression;
                    target.Refresh();
                }
            };
    }
}

function updateAjaxData(dataurl, postprocessor, chartdata){
      $.ajax({
            url: dataurl,
        })
            .done(function (data) {
                var result = postprocessor(data);
                if(chartdata===null){
                    chartdata = result;
                }
                else{
                    chartdata.datasets.push(result.datasets[0]);
                }
            });
}

function removeAllChildren(elementId){
    var node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
