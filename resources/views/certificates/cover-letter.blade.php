<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Cover Letter - {{ $certificate->cover_letter_no }}</title>
    <style>
        @page {
            margin: 20px;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 14px;
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table, th, td {
            border: 1px solid #000;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .company-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .logo {
            width: 100px;
        }
        .section-title {
            background-color: #e0e0e0;
            padding: 8px;
            font-weight: bold;
            margin-top: 15px;
            margin-bottom: 10px;
        }
        ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        li {
            margin-bottom: 3px;
        }
        .page-break {
            page-break-after: always;
        }
        .small-text {
            font-size: 8px;
        }
    </style>
</head>
<body>
    <!-- PAGE 1: Cover Letter -->
    <div class="header">
        <h1>COVER LETTER</h1>
    </div>

    <table>
        <tr>
            <td style="width: 50%;">
                <strong>IFFCO TOKIO GENERAL INSURANCE CO. LTD</strong><br>
                Regd. Office: IFFCO SADAN, C1 Distt. Centre,<br>
                Saket, New<br>
                Delhi- 110017<br>
                Corporate Identification Number (CIN)<br>
                U74899DL2000PLC107748<br>
                IRDA Reg. No. 108
            </td>
            <td style="width: 50%;">
                <strong>ISSUING OFFICE:</strong><br>
                IFFCO TOKIO GEN INSU. CO. LTD., A/2, Reliance<br>
                House<br>
                Isidorio Baptista Rd., Panjford,<br>
                Margao, Salcete<br>
                MARGAO - 403801<br>
                Tax No.: 008570714 | E Fax No.:
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <td colspan="2"><strong>Insured's Name:</strong> {{ $certificate->insured_name }}</td>
            <td><strong>Master Policy Number:</strong> {{ $policy->number }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Insured's Address:</strong> {{ $certificate->insured_address }}</td>
            <td><strong>Broker:</strong> {{ $policy->partner->name ?? 'Zoom Insurance Brokers Private Limited' }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Insured's Email:</strong> {{ $certificate->insured_email }}</td>
            <td><strong>Mode of Transit:</strong> {{ $certificate->voyage_from && $certificate->voyage_to ? 'surface' : '-' }}</td>
        </tr>
        <tr>
            <td colspan="2"><strong>Insured's Mobile:</strong> {{ $certificate->insured_mobile }}</td>
            <td><strong>Type of Certificate:</strong> Cover Letter</td>
        </tr>
    </table>

    <table>
        <tr>
            <td><strong>Cover Letter No:</strong> {{ $certificate->cover_letter_no }}</td>
            <td><strong>AWB/BL/LR No:</strong> {{ $certificate->gr_lr_number }}</td>
        </tr>
        <tr>
            <td><strong>Transit From:</strong> {{ $certificate->voyage_from }}</td>
            <td><strong>Transit To:</strong> {{ $certificate->voyage_to }}</td>
        </tr>
        <tr>
            <td><strong>Invoice Value (INR):</strong> {{ number_format($certificate->cargo_value, 2) }}</td>
            <td><strong>AWB/BL/LR Date:</strong> {{ $certificate->gr_lr_date ? date('d/m/Y', strtotime($certificate->gr_lr_date)) : '-' }}</td>
        </tr>
        <tr>
            <td><strong>Invoice No:</strong> {{ $certificate->invoice_number }}</td>
            <td><strong>Invoice Date:</strong> {{ $certificate->invoice_date ? date('d/m/Y', strtotime($certificate->invoice_date)) : '-' }}</td>
        </tr>
    </table>

    <div class="section-title">Excess</div>
    <p>0.5% of whole shipment value subject to Minimum of Rs 5000 for each and every claim</p>

    <div class="page-break"></div>

    <!-- PAGE 2: Clauses and Conditions -->
    <div class="section-title">Clauses and Conditions:</div>
    <ul>
        <li>Basis of valuation for used goods - Depreciated Market Value</li>
        <li>Brand new goods - Institute Replacement Clause</li>
        <li>Cancellation Clause</li>
        <li>Cargo ISM Endorsement</li>
        <li>CARGO ISM FORWARDING CHARGES CLAUSE</li>
        <li>Country Specification Clause</li>
        <li>Debris Clause</li>
        <li>Duty Clause</li>
        <li>Electronic Date Recognition Exclusion Clause</li>
        <li>Gulf of Aden Clause</li>
        <li>Important Notice Clause</li>
        <li>Institute Classification Clause 01/01/2001</li>
        <li>Institute Cyber Attack Exclusion Clause 10/11/03</li>
        <li>Institute Radioactive Contamination Exclusion Clause 01/10/90 and U.S.A. Endorsement USEN01</li>
        <li>Institute Radioactive Contamination, Chemical, Biological, Bio Chemical and Electromagnetic Weapons Exclusion Clause 10/11/03</li>
        <li>Joint Cargo Committee Termination of Transit Clause (Terrorism) Amended (01/01/09)</li>
        <li>Non-Transferability Clause</li>
        <li>Pair & Set Clause</li>
        <li>S.R.C.C Cancellation Clause</li>
        <li>Sanctions and Limitation Clause (LMA 3100)</li>
        <li>Second hand or Used goods /Return transits covered as per ITC B-SRCC subject to JCC</li>
        <li>Strikes Cancellation Clause (Air Cargo)</li>
        <li>Strikes Cancellation Clause (Cargo)</li>
        <li>Termination Of Transit Clause (Terrorism)</li>
        <li>Used Goods - Second Hand Machinery Replacement Clause</li>
        <li>War Cancellation Clause</li>
    </ul>

    <div class="section-title">Terms Of Cover:</div>
    <p>
        Inland Transit Clause (A) 1.1.2010 + Strikes Riots And Civil Commotions Clause<br>
        Institute Cargo Clause (A) 1.1.2009 + Institute War Clauses (Cargo) & Institute Strikes Clauses (Cargo)<br>
        Institute Cargo Clause (Air) 1.1.2009 (Excluding Sendings By Post) + Institute War Clauses (Air Cargo) & Institute Strikes Clauses (Air Cargo)
    </p>

    <div class="page-break"></div>

    <!-- PAGE 3: Liability and Documentation -->
    <div class="section-title">In case of claim please contact for survey and claim settlement:</div>
    <p>
        ITGI, PUNE CSC Office no. 16, 6TH Floor, Suyog Platinum Tower, Mangaldas Road, Pune PUNE-411001 Phone No:
    </p>

    <p class="small-text"><strong>Important Notice - Procedure in the event of loss or damage</strong></p>

    <div class="section-title">Liability of Carriers, Bailees or other Third Parties:</div>
    <p class="small-text">
        It is the duty of the Assured and their Agents, in all cases, to take such measures as may be reasonable for the purpose of averting or minimizing a loss and to ensure that all rights against Carriers, Bailees or other third parties are properly preserved and exercised. In particular, the Assured or their Agents are required: 1. To claim immediately on the Carriers, Port Authorities or other Bailees for any missing packages. 2. In all cases where the nature and extent of loss or damage may be in doubt, and also where salvage may be involved, to apply immediately for survey by Carriers' or other Bailees' Representatives, so that there may be no question hereafter as to the fact that loss or damage occurred whilst the subject matter insured was in their custody. 3. When delivery of the subject matter insured is being taken, to ensure that it and any receptacles or coverings are examined immediately by their responsible official. If the Container is delivered damaged or with seals broken or missing or with seals other than as stated in the container packing list, to inform the Carriers or delivery receipt accordingly and retain all defective or irregular seals for subsequent identification. 4. To apply immediately for survey by Carriers' or other Bailees' Representatives if any loss or damage is apparent and to provide them with the delivery receipt noting any apparent loss or damage found at such survey. 5. To give notice in writing to the Carriers or other Bailees within 3 days of delivery if the loss or damage was not apparent at the time of taking delivery.
    </p>

    <div class="section-title">Address for correspondence with IFFCO Tokio:</div>
    <p>IFFCO TOKIO GEN INSU. CO. LTD. , A/2, Reliance House , Isidorio Baptista Rd , Panjford, Margao, Salcete MARGAO - 403801</p>

    <div class="section-title">Documentation of Claims:</div>
    <p class="small-text">
        To enable claims to be dealt with promptly, the Assured or their Agents are advised to submit all available supporting documents without delay, including when applicable: 1. Original policy or certificate of insurance. 2. Original or copy shipping invoice, showing the value of the goods and specification thereof. 3. Original Bill of Lading or other Contract of carriage. 4. Any other documentary evidence to show the extent of the loss or the damage.5. Landing account and weight notes at final destination.6. Correspondence exchanged with the Carriers or other Bailees regarding their liability for the loss or damage.NOTE - The Consignees or their Agents are recommended to make themselves familiar with the terms and conditions of the Bills of Lading and/or any Contracts of carriage regarding any, payable to the Assured or under upon surrender of this Certificate. It is understood and agreed that this Certificate represents and takes the place of the policy and conveys all the rights of the original policy holder (for the purpose of collecting any loss or damage that may become payable there under) to the party or parties named therein as the Assured or order, or to bearer, or to whosoever this Certificate is assigned by a specific policy direct through the holder of this Certificate. It is agreed that upon payment of any loss or damage; the Insurers are to be subrogated to the extent of such payments to all the rights of the Assured under the Bills of Lading or other contracts of carriage.
    </p>

    <div class="page-break"></div>

    <!-- PAGE 4: Warranties and Disclaimer -->
    <p class="small-text">
        Warranted that dispatches originating/ terminating  from/ to the following countries would be covered from/ till the warehouse in India, subject to ITC 'A', CIS and African nations. Warranted that excess for CIS, Africa and other approved and specified countries would be at 1.00 % of Declared Value with a minimum deductible to be applicable for G .A .arising out of piracy also. Warranted that this certificate will be considered as null and void unless the vessel conforms to Vessel Specification Clause appended to the respective Open Policy
    </p>

    <p class="small-text" style="margin-top: 20px;">
        Certificate is issued subject to terms and conditions, warranties, exclusions as per Marine Open Policy no. given above. Note: This document is not a tax invoice for claiming input tax credit under GST laws. Call centre : 1800-103-5499 (Toll Free); Claim Settling Agent : http://www.tokiomarine-nichido.co.jp/english/products/global-cargo.html www.iffcotokio.co.in
    </p>

    <p class="small-text" style="margin-top: 15px;">
        <strong>Disclaimer</strong> - Any change in tax during the currency of the policy shall have a direct impact on the premium and same will be adjusted in the tax component calculated at the time of issuance of certificates
    </p>

    <p class="small-text" style="margin-top: 15px; font-style: italic;">
        *This cover letter is only for directional purposes. The actual terms will apply as per the master policy no. "{{ $policy->number }}" shared with the client.
    </p>
</body>
</html>
