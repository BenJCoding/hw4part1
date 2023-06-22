/*   File: script.js
     GUI Assignment: JQ Validation
     Author: Benjamin Jancsy
     Created: June 21, 2023
     Dynamically creates a custom multiplication table, validating user input and handling errors. Displays
     helpful error messages. Includes useful UI features such as reset input and clear table buttons.
     Copyright (c) 2023 by Ben.
     References: w3schools.com, jqueryvalidation.org
*/
$().ready(function() {
 jQuery.validator.addMethod("greq", function( value, element, param) {
        // Bind to the blur event of the target in order to revalidate whenever the target field is updated
        var target = $( param ); // my source of this code was editing jqvalidator source code's "equalTo" method.
            if ( this.settings.onfocusout && target.not( ".validate-equalTo-blur" ).length ) {
            target.addClass( "validate-equalTo-blur" ).on( "blur.validate-equalTo", function() {
                $( element ).valid();
            } );
        }
        return Number(value) >= Number(target.val());
    });
    jQuery.validator.addMethod("nondecimal", function(value, element) {
        return /^-?[0-9]+$/.test(value);
    });
    jQuery.validator.addMethod("size", function( value, element) {
        var a = Number($("#lowcol").val());
        var b = Number($("#highcol").val());
        var c = Number($("#lowrow").val());
        var d = Number($("#highrow").val());
        //alert(a + " " + b + " " +  c + " " + d);
        if (isNaN(a)) {
            a = 1
        }
        if (isNaN(b)) {
            b = 1
        }
        if (isNaN(c)) {
            c = 1
        }
        if (isNaN(d)) {
            d = 1
        }
        return ((b - a + 1) * (d - c + 1) <= 20000); // Limits the table size to 20k cells.
    });
    var validator = $("#form").validate({
        rules: {
            lowcol: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999999999999, 999999999999],

            },
            highcol: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999999999999, 999999999999],
                greq: "#lowcol",
                size: true
            },
            lowrow: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999999999999, 999999999999],

            },
            highrow: {
                required: true,
                number: true,
                nondecimal: true,
                range: [-999999999999, 999999999999],
                greq: "#lowrow",
                size: true
            },
        },
        messages: {
            lowcol: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "12 digit (-/+) maximum!",
            },
            highcol: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "12 digit (-/+) maximum!",
                greq: "Must be >= the left value!",
                size: "Table size! (max 20k cells)."
            },
            lowrow: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "12 digit (-/+) maximum!",
            },
            highrow: {
                required: "This field is required!",
                number: "Please use an integer!",
                nondecimal: "No decimals allowed!",
                range: "12 digit (-/+) maximum!",
                greq: "Must be >= the left value!",
                size: "Table size! (max 20k cells)."
            },
        },
        submitHandler: function(form) {
            var ranges = document.getElementsByClassName("ranges"); // the values
            var a = Number(ranges[0].value.trim());
            var b = Number(ranges[1].value.trim());
            var c = Number(ranges[2].value.trim());
            var d = Number(ranges[3].value.trim());
            makeTable(a, b, c, d);
            return false;
        },
    });
    $("#reset").click(function() {
        validator.resetForm();
        window.location.reload(1);
    });
    $('#lowcol, #highcol, #lowrow, #highrow').on('change', function() {
        if($("#lowcol").val() && $("#highcol").val() && $("#lowrow").val() && $("#highrow").val()) {
            $('#form').valid();
        }
    });
});

function makeTable(a, b, c, d) { // Where the table is made
    var data = [];
    var row = [];
    var rowhead = [];
    var colhead = [];
    rowhead.push('X'); // top left element
    for (var i = a; i <= b; i++) { // horizontal table head
        rowhead.push(i);
    }
    for (var i = c; i <= d; i++) { // vertical table head
        colhead.push(i);
    }
    for (var x = c; x <= d; x++) { // the 2d array of the entire table
        for (var y = a; y <= b; y++) {
            row.push(x * y);
        }
        data.push(row);
        row = [];
    }
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    rowhead.forEach((head) => { // pushes the header row onto the table
        let th = document.createElement('th');
        th.textContent = head; // make it a th element not just text
        thead.appendChild(th); // put the data onto the head row
    });
    table.appendChild(thead); // attaches it
    data.forEach((row_data) => { // for every row of data array (not header)
        let row = document.createElement('tr');
        let chead = document.createElement('th'); // the header of each row
        chead.textContent = colhead.shift(); //pop the front element for the vertical head
        row.appendChild(chead); //attaches
        row_data.forEach((cell_data) => { //for each cell of the row...
            let cell = document.createElement('td'); // element is a td
            cell.textContent = cell_data; //data
            row.appendChild(cell); // attach to the row
        });
        table.appendChild(row);//attach to table
    });
    let tablediv = document.getElementById('tablediv');
    tablediv.innerHTML = "";//clears an old table before showing a new one
    document.getElementById('tablediv').appendChild(table); //show the table
}

document.getElementById("clear").addEventListener("click", () => { // Clear the table
    let tablediv = document.getElementById('tablediv');
    tablediv.innerHTML = "";
});
