# Offshore-Customer-Data-Management-System-SPFx-.NET-Azure-Power-BI-
End-to-end enterprise application for collecting offshore customer data from websites, managing it in SharePoint, syncing to Azure SQL, exposing APIs, exporting via OpenXML, and visualizing insights using Power BI.This project is an end-to-end enterprise data management and analytics solution designed to collect, manage, sync, and visualize offshore customer information.

The system gathers structured customer data from public websites, stores and manages it via SharePoint, synchronizes it to Azure SQL, exposes it through a .NET Core Web API, supports OpenXML-based exports, and provides Power BI dashboards for business insights.

🧩 Key Features
1️⃣ Customer Data Collection

Data gathered from customer websites:

Customer Name
Address
Number of Rigs
Number of Jack-Ups
Number of MODUs
Official Website URLs

Customers covered:
Noble, Transocean, Valaris, Shell, Vantage, Shelf

2️⃣ SharePoint List

Centralized SharePoint List to store customer data
Structured columns matching business requirements
Acts as the master data source

3️⃣ Custom SPFx Form

Built using SharePoint Framework (SPFx)
User-friendly custom form for:
Viewing data
Editing customer records
Maintaining data consistency

4️⃣ Hotsync C# Application (Stretch Target)

Console-based C# Hotsync service
Pulls data from SharePoint List
Pushes data into Azure SQL Database
Ensures near real-time data availability

5️⃣ .NET Core Web API (Without Entity Framework)
Built using .NET Core MVC
Pure ADO.NET (no Entity Framework)
Supports full CRUD operations:
Create
Read
Update
Delete
Exposes hotsynced data securely

6️⃣ Power BI Reporting

Interactive Power BI dashboard
Visualizations include:
Customer-wise rig distribution
MODU and Jack-Up counts
Summary KPIs
Connected directly to Azure SQL

7️⃣ OpenXML Excel Export API

API endpoint to export data as Excel (.xlsx)
Implemented using OpenXML SDK
Produces tabular reports matching enterprise standards

8️⃣ OpenXML Word Export API

API endpoint to generate Word (.docx) reports
Document structure aligned with provided sample
Automated report generation for stakeholders
