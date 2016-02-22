/**
 * Created by Aditya on 2/22/2016.
 */
/// <reference path="../typings/browser/ambient/jquery/jquery.d.ts"/>
(function ($) {
    $.fn.tabullet = function (options) {
        var defaults = {
            rowClass: '',
            columnClass: '',
            tableClass: 'table',
            textClass: 'form-control',
            editClass: 'btn btn-default',
            deleteClass: 'btn btn-danger',
            saveClass: 'btn btn-success',
            deleteContent: 'Delete',
            editContent: 'Edit',
            saveContent: 'Save',
            action: function () {
            }
        };
        options = $.extend(defaults, options);
        var columns = $(this).find('thead > tr th');
        var idMap = $(this).find('thead > tr').first().attr('data-tabullet-map');
        var metadata = [];
        columns.each(function (i, v) {
            metadata.push({
                map: $(v).attr('data-tabullet-map'),
                readonly: $(v).attr('data-tabullet-readonly'),
                type: $(v).attr('data-tabullet-type')
            });
        });
        var index = 0;
        var data = options.data;
        $(data).each(function (i, v) {
            v._index = index++;
        });
        var table = this;
        $(table).find("tbody").remove();
        var tbody = $("<tbody/>").appendTo($(this));
        // INSERT
        var insertRow = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', "-1");
        $(metadata).each(function (i, v) {
            if (v.type === 'delete') {
                var td = $("<td/>").appendTo(insertRow);
                return;
            }
            if (v.type === 'edit') {
                var td = $("<td/>")
                    .html('<button class="' + options.saveClass + '">' + options.saveContent + '</button>')
                    .attr('data-tabullet-type', 'save')
                    .appendTo(insertRow);
                td.find('button').click(function (event) {
                    var saveData = [];
                    var rowParent = td.closest('tr');
                    var rowChildren = rowParent.find('input');
                    $(rowChildren).each(function (ri, rv) {
                        saveData[$(rv).attr('name')] = $(rv).val();
                    });
                    options.action('save', saveData);
                    return;
                });
                return;
            }
            if (v.readonly !== 'true') {
                $('<td/>').html('<input type="text" name="' + v.map + '" class="' + options.textClass + '"/>')
                    .appendTo(insertRow);
            }
            else {
                $("<td/>").appendTo(insertRow);
            }
        });
        $(data).each(function (i, v) {
            var tr = $("<tr/>").appendTo($(tbody)).attr('data-tabullet-id', v[idMap]);
            $(metadata).each(function (mi, mv) {
                if (mv.type === 'delete') {
                    var td = $("<td/>")
                        .html('<button class="' + options.deleteClass + '">' + options.deleteContent + '</button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        tr.remove();
                        options.action('delete', $(tr).attr('data-tabullet-id'));
                    });
                }
                else if (mv.type === 'edit') {
                    var td = $("<td/>")
                        .html('<button class="' + options.editClass + '">' + options.editContent + '</button>')
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                    td.find('button').click(function (event) {
                        if ($(this).attr('data-mode') === 'edit') {
                            var editData = [];
                            var rowParent = td.closest('tr');
                            var rowChildren = rowParent.find('input');
                            $(rowChildren).each(function (ri, rv) {
                                editData[$(rv).attr('name')] = $(rv).val();
                            });
                            editData[idMap] = $(rowParent).attr('data-tabullet-id');
                            options.action('edit', editData);
                            return;
                        }
                        $(this).removeClass(options.editClass).addClass(options.saveClass).html(options.saveContent)
                            .attr('data-mode', 'edit');
                        var rowParent = td.closest('tr');
                        var rowChildren = rowParent.find('td');
                        $(rowChildren).each(function (ri, rv) {
                            if ($(rv).attr('data-tabullet-type') === 'edit' ||
                                $(rv).attr('data-tabullet-type') === 'delete') {
                                return;
                            }
                            var mapName = $(rv).attr('data-tabullet-map');
                            if ($(rv).attr('data-tabullet-readonly') !== 'true') {
                                $(rv).html('<input type="text" name="' + mapName + '" value="' + v[mapName] + '" class="' + options.textClass + '"/>');
                            }
                        });
                    });
                }
                else {
                    var td = $("<td/>").html(v[mv.map])
                        .attr('data-tabullet-map', mv.map)
                        .attr('data-tabullet-readonly', mv.readonly)
                        .attr('data-tabullet-type', mv.type)
                        .appendTo(tr);
                }
            });
        });
    };
}(jQuery));
