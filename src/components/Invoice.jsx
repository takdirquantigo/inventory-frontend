import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// --- Styles Adjusted for A6 ---
const styles = StyleSheet.create({
  page: {
    padding: '15 20', // Reduced padding for smaller canvas
    backgroundColor: '#F7F6E8',
    fontFamily: 'Helvetica',
    fontSize: 7, // Smaller base font for A6
    color: '#000000',
  },
  line: {
    borderBottomWidth: 0.5, // Thinner lines
    borderBottomColor: '#BFBFBF',
    marginBottom: 8,
  },

  // -- Header Section --
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  logoInvoice: {
    fontSize: 22, // Scaled down from 72
    fontWeight: 'bold',
    letterSpacing: -1,
  },
    headline: {
    fontSize: 16, // Scaled down from 72
    fontWeight: 600,
    letterSpacing: -1,
  },
  headerInfo: {
    textAlign: 'right',
    paddingBottom: 4,
  },
  headerTextRegular: {
    fontSize: 6,
    marginBottom: 1,
  },
  headerTextBold: {
    fontSize: 6,
    fontWeight: 'bold',
  },

  // -- Billed To Section --
  billedToRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  billedToColLeft: {
    width: 40,
  },
  billedToColRight: {
    flex: 1,
  },
  labelTextBold: {
    fontWeight: 'bold',
    fontSize: 7,
  },
  contactText: {
    fontSize: 6.5,
    lineHeight: 1.3,
  },

  // -- Table Section --
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#BFBFBF',
    paddingBottom: 3,
    marginBottom: 3,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  tableColDescription: { width: '45%' },
  tableColRate: { width: '20%', textAlign: 'right' },
  tableColHours: { width: '15%', textAlign: 'right' },
  tableColAmount: { width: '20%', textAlign: 'right' },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 6.5,
  },
  tableCellText: {
    fontSize: 6.5,
  },

  // -- Totals Section --
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
  },
  totalsColLabels: {
    width: 60,
    textAlign: 'right',
    paddingRight: 5,
  },
  totalsColValues: {
    width: 50,
    textAlign: 'right',
  },
  totalsLabelBold: {
    fontWeight: 600,
  },
  totalsTaxLabel: {
    fontSize: 5.5,
    color: '#333333',
  },
  totalsValueTotal: {
    fontSize: 8,
    fontWeight: 600,
    marginTop: 2,
  },

  // -- Footer Section (Payment + Studio Info) --
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 15, // Pinned higher for A6
    left: 20,
    right: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#BFBFBF',
    paddingTop: 8,
  },
  footerColumn: {
    width: '48%',
  },
  footerTitle: {
    fontWeight: 'bold',
    fontSize: 6,
    marginBottom: 2,
  },
  footerDetails: {
    fontSize: 5.5,
    lineHeight: 1.2,
  },
  footerDetailsBold: {
    fontSize: 6,
    fontWeight: 'bold',
    marginBottom: 1,
  }
});

const cylinderTypes = [
  { label: '5KG', key: 'five_kg', emptyKey: 'empty_five_kg', priceKey: 'price_5_kg' },
  { label: '12KG', key: 'twelve_kg', emptyKey: 'empty_twelve_kg', priceKey: 'price_12_kg' },
  { label: '25KG', key: 'twentyfive_kg', emptyKey: 'empty_twentyfive_kg', priceKey: 'price_25_kg' },
  { label: '33KG', key: 'thirtythree_kg', emptyKey: 'empty_thirtythree_kg', priceKey: 'price_33_kg' },
  { label: '35KG', key: 'thirtyfive_kg', emptyKey: 'empty_thirtyfive_kg', priceKey: 'price_35_kg' },
  { label: '45KG', key: 'fourtyfive_kg', emptyKey: 'empty_fourtyfive_kg', priceKey: 'price_45_kg' },
  { label: 'Others', key: 'others_kg', emptyKey: 'empty_others_kg', priceKey: null },
];
const InvoiceA6 = ({ content }) => (
  <Document>
    {/* Change size to A6 here */}
    <Page size="A6" style={styles.page}>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.logoInvoice}>Invoice</Text> <br />
         <Text style={styles.headline}>Mohammad Enterprise</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTextRegular}>{content?.date}</Text>
          <Text style={styles.headerTextBold}>#{content?.id}</Text>
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.billedToRow}>
        <View style={styles.billedToColLeft}>
          <Text style={styles.labelTextBold}>Billed to:</Text>
        </View>
        <View style={styles.billedToColRight}>
          <Text style={styles.contactText}>{content?.customer?.name}</Text>
          <Text style={styles.contactText}>
            Customer ID:{' '}
            {content?.customer?.customer_login_id != null && content?.customer?.customer_login_id !== ''
              ? String(content.customer.customer_login_id)
              : '—'}
          </Text>
          <Text style={styles.contactText}>{content?.customer?.phone}</Text>
          <Text style={styles.contactText}>{content?.customer?.address}</Text>
        </View>
      </View>

      <View>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableColDescription, styles.tableHeaderText]}>Items</Text>
          <Text style={[styles.tableColRate, styles.tableHeaderText]}>Qty</Text>
          <Text style={[styles.tableColHours, styles.tableHeaderText]}> Price</Text>
          <Text style={[styles.tableColAmount, styles.tableHeaderText]}>Total</Text>
        </View>
        {cylinderTypes.map((item, index) => {
          const qty = Number(content?.[item.key]) || 0;
          const emptyQty = Number(content?.[item.emptyKey]) || 0;
          const price = item.priceKey ? Number(content?.[item.priceKey]) || 0 : 0;

          if (!qty && !emptyQty) return null;

          return (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableColDescription}>{item.label}</Text>

              <Text style={styles.tableColRate}>
                {qty}/{emptyQty}
              </Text>

              <Text style={styles.tableColHours}>
                {price}
              </Text>

              <Text style={styles.tableColAmount}>
                {qty * price}
              </Text>
            </View>
          );
        })}



      </View>

      <View style={styles.totalsRow}>
        <View style={styles.totalsColLabels}>
          {content?.other_cost_name && <Text style={styles.totalsValueTotal}>{content?.other_cost_name}</Text>}
          <Text style={styles.totalsValueTotal}>Total</Text>

          <Text style={styles.totalsValueTotal}>Pay</Text>
          <Text style={styles.totalsValueTotal}>Due</Text>
        </View>
        <View style={styles.totalsColValues}>
          {content?.other_cost_name && <Text style={styles.totalsValueTotal}>{content?.other_cost_amount || 0}</Text>}
          <Text style={styles.totalsValueTotal}>{(parseFloat(content?.other_cost_amount) || 0) + (parseFloat(content?.price) || 0)}</Text>
          <Text style={styles.totalsValueTotal}>{content?.pay}</Text>
          <Text style={styles.totalsValueTotal}>{(parseFloat(content?.other_cost_amount) || 0) + (parseFloat(content?.price) || 0) - (parseFloat(content?.pay) || 0)}</Text>
        </View>
      </View>

      <View style={styles.footerContainer} fixed>
        <View style={styles.footerColumn}>
          <Text style={styles.footerTitle}>Mohammad Enterprise</Text>
          <Text style={styles.footerDetailsBold}>Phone: 01792429367</Text>
          <Text style={styles.footerDetails}>Address: 336/B, Khilgaon, Dhaka</Text>
        </View>

        <View style={[styles.footerColumn, { textAlign: 'right' }]}>
          <Text style={styles.footerDetailsBold}>{content?.customer?.name}</Text>
          <Text style={styles.footerDetails}>
            Customer ID:{' '}
            {content?.customer?.customer_login_id != null && content?.customer?.customer_login_id !== ''
              ? String(content.customer.customer_login_id)
              : '—'}
          </Text>
          <Text style={styles.footerDetails}>{content?.customer?.phone}</Text>
        </View>
      </View>

    </Page>
  </Document>
);

export default InvoiceA6;