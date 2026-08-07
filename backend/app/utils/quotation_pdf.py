from io import BytesIO
from typing import Any

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def generate_quotation_pdf(quotation: dict[str, Any]) -> BytesIO:
    """
    Generate a professional quotation PDF.

    Returns:
        BytesIO: PDF file stream.
    """

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title=str(
            quotation.get(
                "quotation_number",
                "Quotation",
            )
        ),
        author="GKT Software Solution",
    )

    styles = getSampleStyleSheet()

    # =========================================================
    # STYLES
    # =========================================================

    company_style = ParagraphStyle(
        "CompanyStyle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#1d4ed8"),
        spaceAfter=5,
    )

    company_subtitle_style = ParagraphStyle(
        "CompanySubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#64748b"),
    )

    quotation_title_style = ParagraphStyle(
        "QuotationTitle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        alignment=TA_RIGHT,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=10,
    )

    section_style = ParagraphStyle(
        "SectionStyle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=5,
    )

    normal_style = ParagraphStyle(
        "NormalCustom",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#334155"),
    )

    small_style = ParagraphStyle(
        "SmallStyle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748b"),
    )

    table_header_style = ParagraphStyle(
        "TableHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=TA_CENTER,
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#334155"),
    )

    table_cell_right_style = ParagraphStyle(
        "TableCellRight",
        parent=table_cell_style,
        alignment=TA_RIGHT,
    )

    total_label_style = ParagraphStyle(
        "TotalLabel",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=colors.HexColor("#0f172a"),
    )

    total_value_style = ParagraphStyle(
        "TotalValue",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        alignment=TA_RIGHT,
        textColor=colors.HexColor("#1d4ed8"),
    )

    # =========================================================
    # HELPER
    # =========================================================

    def safe_text(value: Any, default: str = "-") -> str:
        """
        Convert any value safely to string.
        """
        if value is None:
            return default

        text = str(value).strip()

        return text if text else default

    def money(value: Any) -> str:
        """
        Format amount as Indian Rupees.
        """
        try:
            return f"₹{float(value or 0):,.2f}"
        except (TypeError, ValueError):
            return "₹0.00"

    def paragraph(
        value: Any,
        style: ParagraphStyle = normal_style,
    ) -> Paragraph:
        """
        Always return a Paragraph.
        This keeps ReportLab/Pylance typing consistent.
        """
        return Paragraph(
            safe_text(value),
            style,
        )

    # =========================================================
    # STORY
    # =========================================================

    story: list[Any] = []

    # =========================================================
    # COMPANY HEADER
    # =========================================================

    story.append(
        Paragraph(
            "GKT SOFTWARE SOLUTION",
            company_style,
        )
    )

    story.append(
        Paragraph(
            "Software Development • Web Development • AI Solutions",
            company_subtitle_style,
        )
    )

    story.append(
        Paragraph(
            "Avadi, Chennai - 600054, Tamil Nadu",
            company_subtitle_style,
        )
    )

    story.append(
        Paragraph(
            "+91 8778341227 • gktsoftwaresolution@gmail.com",
            company_subtitle_style,
        )
    )

    story.append(
        Spacer(1, 12)
    )

    # =========================================================
    # QUOTATION TITLE
    # =========================================================

    story.append(
        Paragraph(
            "QUOTATION",
            quotation_title_style,
        )
    )

    # =========================================================
    # QUOTATION INFORMATION
    # =========================================================

    created_at = quotation.get(
        "createdAt",
        "",
    )

    if hasattr(created_at, "strftime"):
        quotation_date = created_at.strftime("%d %b %Y")
    else:
        quotation_date = safe_text(created_at)[:10]

    quotation_info = [
        [
            paragraph(
                "<b>Quotation No</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "quotation_number",
                    "-",
                ),
                normal_style,
            ),
            paragraph(
                "<b>Date</b>",
                normal_style,
            ),
            paragraph(
                quotation_date,
                normal_style,
            ),
        ],
        [
            paragraph(
                "<b>Project</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "project_name",
                    "-",
                ),
                normal_style,
            ),
            paragraph(
                "<b>Status</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "status",
                    "Draft",
                ),
                normal_style,
            ),
        ],
        [
            paragraph(
                "<b>Valid Until</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "valid_until",
                    "-",
                ),
                normal_style,
            ),
            paragraph(
                "<b>Validity</b>",
                normal_style,
            ),
            paragraph(
                f"{quotation.get('validity_days', 15)} Days",
                normal_style,
            ),
        ],
    ]

    quotation_table = Table(
        quotation_info,
        colWidths=[
            30 * mm,
            55 * mm,
            25 * mm,
            55 * mm,
        ],
    )

    quotation_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#f8fafc"),
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#dbe4ef"),
                ),
                (
                    "INNERGRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#e2e8f0"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(quotation_table)

    story.append(
        Spacer(1, 16)
    )

    # =========================================================
    # CLIENT INFORMATION
    # =========================================================

    story.append(
        Paragraph(
            "CLIENT INFORMATION",
            section_style,
        )
    )

    client_data = [
        [
            paragraph(
                "<b>Client Name</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "client_name",
                    "-",
                ),
                normal_style,
            ),
        ],
        [
            paragraph(
                "<b>Company</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "company_name",
                    "-",
                ),
                normal_style,
            ),
        ],
        [
            paragraph(
                "<b>Email</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "client_email",
                    "-",
                ),
                normal_style,
            ),
        ],
        [
            paragraph(
                "<b>Phone</b>",
                normal_style,
            ),
            paragraph(
                quotation.get(
                    "client_phone",
                    "-",
                ),
                normal_style,
            ),
        ],
    ]

    client_table = Table(
        client_data,
        colWidths=[
            35 * mm,
            130 * mm,
        ],
    )

    client_table.setStyle(
        TableStyle(
            [
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#dbe4ef"),
                ),
                (
                    "INNERGRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#e2e8f0"),
                ),
                (
                    "BACKGROUND",
                    (0, 0),
                    (0, -1),
                    colors.HexColor("#f8fafc"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(client_table)

    story.append(
        Spacer(1, 18)
    )

    # =========================================================
    # PROJECT BILLING
    # =========================================================

    story.append(
        Paragraph(
            "PROJECT BILLING",
            section_style,
        )
    )

    items: list[list[Any]] = []

    # Header row
    items.append(
        [
            Paragraph("#", table_header_style),
            Paragraph(
                "Description",
                table_header_style,
            ),
            Paragraph(
                "Qty",
                table_header_style,
            ),
            Paragraph(
                "Rate",
                table_header_style,
            ),
            Paragraph(
                "Amount",
                table_header_style,
            ),
        ]
    )

    quotation_items = quotation.get(
        "items",
        [],
    )

    for index, item in enumerate(
        quotation_items,
        start=1,
    ):
        quantity = item.get(
            "quantity",
            0,
        )

        rate = item.get(
            "rate",
            0,
        )

        amount = item.get(
            "amount",
            0,
        )

        items.append(
            [
                Paragraph(
                    str(index),
                    table_cell_style,
                ),
                Paragraph(
                    safe_text(
                        item.get(
                            "description",
                            "",
                        )
                    ),
                    table_cell_style,
                ),
                Paragraph(
                    safe_text(quantity),
                    table_cell_right_style,
                ),
                Paragraph(
                    money(rate),
                    table_cell_right_style,
                ),
                Paragraph(
                    money(amount),
                    table_cell_right_style,
                ),
            ]
        )

    # If no items exist
    if len(items) == 1:
        items.append(
            [
                Paragraph(
                    "-",
                    table_cell_style,
                ),
                Paragraph(
                    "No billing items added",
                    table_cell_style,
                ),
                Paragraph(
                    "0",
                    table_cell_right_style,
                ),
                Paragraph(
                    money(0),
                    table_cell_right_style,
                ),
                Paragraph(
                    money(0),
                    table_cell_right_style,
                ),
            ]
        )

    items_table = Table(
        items,
        colWidths=[
            10 * mm,
            75 * mm,
            18 * mm,
            30 * mm,
            32 * mm,
        ],
        repeatRows=1,
    )

    items_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1d4ed8"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#dbe4ef"),
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (0, -1),
                    "CENTER",
                ),
                (
                    "ALIGN",
                    (2, 1),
                    (-1, -1),
                    "RIGHT",
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#f8fafc"),
                    ],
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(items_table)

    story.append(
        Spacer(1, 10)
    )

    # =========================================================
    # TOTALS
    # =========================================================

    totals_data = [
        [
            Paragraph(
                "Subtotal",
                normal_style,
            ),
            Paragraph(
                money(
                    quotation.get(
                        "subtotal",
                        0,
                    )
                ),
                table_cell_right_style,
            ),
        ],
        [
            Paragraph(
                "Discount",
                normal_style,
            ),
            Paragraph(
                f"- {money(quotation.get('discount', 0))}",
                table_cell_right_style,
            ),
        ],
        [
            Paragraph(
                "Taxable Amount",
                normal_style,
            ),
            Paragraph(
                money(
                    quotation.get(
                        "taxable_amount",
                        0,
                    )
                ),
                table_cell_right_style,
            ),
        ],
        [
            Paragraph(
                f"GST ({quotation.get('gst_percentage', 18)}%)",
                normal_style,
            ),
            Paragraph(
                money(
                    quotation.get(
                        "gst_amount",
                        0,
                    )
                ),
                table_cell_right_style,
            ),
        ],
        [
            Paragraph(
                "<b>TOTAL</b>",
                total_label_style,
            ),
            Paragraph(
                f"<b>{money(quotation.get('total', 0))}</b>",
                total_value_style,
            ),
        ],
    ]

    totals_table = Table(
        totals_data,
        colWidths=[
            120 * mm,
            45 * mm,
        ],
        hAlign="RIGHT",
    )

    totals_table.setStyle(
        TableStyle(
            [
                (
                    "ALIGN",
                    (1, 0),
                    (1, -1),
                    "RIGHT",
                ),
                (
                    "LINEABOVE",
                    (0, -1),
                    (-1, -1),
                    1,
                    colors.HexColor("#1d4ed8"),
                ),
                (
                    "BACKGROUND",
                    (0, -1),
                    (-1, -1),
                    colors.HexColor("#eff6ff"),
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(totals_table)

    story.append(
        Spacer(1, 20)
    )

    # =========================================================
    # TERMS & CONDITIONS
    # =========================================================

    story.append(
        Paragraph(
            "TERMS & CONDITIONS",
            section_style,
        )
    )

    terms = quotation.get(
        "terms",
        "",
    )

    if terms:
        for line in str(terms).split("\n"):
            line = line.strip()

            if line:
                story.append(
                    Paragraph(
                        line,
                        normal_style,
                    )
                )

                story.append(
                    Spacer(1, 3)
                )
    else:
        story.append(
            Paragraph(
                "No additional terms and conditions specified.",
                small_style,
            )
        )

    story.append(
        Spacer(1, 25)
    )

    # =========================================================
    # FOOTER MESSAGE
    # =========================================================

    story.append(
        Paragraph(
            "<b>Thank you for choosing GKT Software Solution.</b>",
            company_subtitle_style,
        )
    )

    story.append(
        Spacer(1, 5)
    )

    story.append(
        Paragraph(
            "This quotation is system generated and does not require a physical signature.",
            small_style,
        )
    )

    # =========================================================
    # BUILD PDF
    # =========================================================

    document.build(story)

    buffer.seek(0)

    return buffer