import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.error("No data to export");
        return;
    }
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    // Create CSV content
    const csvContent = [
        // Header row
        headers.join(","),
        // Data rows
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas
            return typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value;
        }).join(","))
    ].join("\n");
    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
export const exportToPDF = (data, filename, title) => {
    if (!data || data.length === 0) {
        console.error("No data to export");
        alert("No data available to export");
        return;
    }
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title || 'Inventory Usage Trends Report', 14, 22);
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 14, 30);
    // Get headers and prepare data
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => row[header] || ''));
    // Generate table - using type assertion
    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 35,
        theme: 'striped',
        headStyles: {
            fillColor: [16, 185, 129], // heritage-green color
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        columnStyles: {
            0: { fontStyle: 'bold', halign: 'left' }, // Month column
        },
        // Highlight total row
        didParseCell: function (data) {
            if (data.row.index === rows.length - 1) {
                data.cell.styles.fillColor = [16, 185, 129];
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fontStyle = 'bold';
            }
        },
        margin: { top: 35 },
    });
    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    // Save the PDF
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
export const exportToExcel = (data, filename) => {
    // For Excel export, we'll use CSV format which Excel can open
    exportToCSV(data, filename);
};
export const exportProcurementToPDF = (data, filename, title) => {
    if (!data || data.length === 0) {
        console.error("No data to export");
        alert("No data available to export");
        return;
    }
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title || 'Procurement Analytics Report', 14, 22);
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 14, 30);
    // Prepare procurement-specific data
    const headers = ['Month', 'Purchase Orders', 'Order Value (₱K)', 'Active Suppliers', 'On-time Delivery (%)'];
    const rows = data.map(row => [
        row.Month || '',
        row['Purchase Orders'] || 0,
        row['Order Value (₱K)'] || 0,
        row['Active Suppliers'] || 0,
        row['On-time Delivery (%)'] || 0
    ]);
    // Generate table
    autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 35,
        theme: 'striped',
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        columnStyles: {
            0: { fontStyle: 'bold', halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' }
        },
        didParseCell: function (data) {
            // Highlight summary row (last row)
            if (data.row.index === rows.length - 1 && data.section === 'body') {
                data.cell.styles.fillColor = [16, 185, 129];
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fontStyle = 'bold';
            }
        },
        margin: { top: 35 },
    });
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
export const exportDepartmentToPDF = (monthlyData, performanceData, filename, title) => {
    if (!monthlyData || monthlyData.length === 0) {
        console.error("No data to export");
        alert("No data available to export");
        return;
    }
    const doc = new jsPDF();
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(title || 'Department Request Trends Report', 14, 22);
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}`, 14, 30);
    // Section 1: Monthly Request Trends
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text('Monthly Request Volume by Department', 14, 45);
    const monthlyHeaders = ['Month', 'Housekeeping', 'Front Office', 'F&B', 'Maintenance', 'Security', 'Total'];
    const monthlyRows = monthlyData.map(row => [
        row.Month || '',
        row.Housekeeping || 0,
        row['Front Office'] || 0,
        row['Food & Beverage'] || 0,
        row.Maintenance || 0,
        row.Security || 0,
        row.Total || 0
    ]);
    autoTable(doc, {
        head: [monthlyHeaders],
        body: monthlyRows,
        startY: 50,
        theme: 'striped',
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        columnStyles: {
            0: { fontStyle: 'bold', halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'center' },
            6: { halign: 'center', fontStyle: 'bold' }
        },
        didParseCell: function (data) {
            // Highlight total row
            if (data.row.index === monthlyRows.length - 1 && data.section === 'body') {
                data.cell.styles.fillColor = [16, 185, 129];
                data.cell.styles.textColor = [255, 255, 255];
                data.cell.styles.fontStyle = 'bold';
            }
        },
        margin: { top: 50 },
    });
    // Get the Y position after the first table
    const finalY = doc.lastAutoTable.finalY || 50;
    // Section 2: Department Performance Metrics
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text('Department Performance Metrics', 14, finalY + 15);
    const performanceHeaders = ['Department', 'Total Requests', 'Avg Response Time', 'Approval Rate'];
    const performanceRows = performanceData.map(dept => [
        dept.name || '',
        dept.requests || 0,
        dept.avgTime || '-',
        `${dept.approval || 0}%`
    ]);
    autoTable(doc, {
        head: [performanceHeaders],
        body: performanceRows,
        startY: finalY + 20,
        theme: 'striped',
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        columnStyles: {
            0: { fontStyle: 'bold', halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'center' },
            3: { halign: 'center' }
        },
        margin: { top: finalY + 20 },
    });
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};
