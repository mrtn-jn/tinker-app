/**
 * Google Apps Script - Email Collection Endpoint
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to: Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire file
 * 5. Click: Deploy → New deployment
 * 6. Select type: Web app
 * 7. Settings:
 *    - Execute as: Me (your@email.com)
 *    - Who has access: Anyone
 * 8. Click: Deploy
 * 9. Authorize access when prompted
 * 10. Copy the Web App URL
 * 11. Paste URL in .env.local as NEXT_PUBLIC_APPS_SCRIPT_URL
 * 
 * IMPORTANT: After making changes to this script, you must:
 * - Click: Deploy → Manage deployments
 * - Click the pencil icon (Edit)
 * - Change "Version" to: New version
 * - Click: Deploy
 */

function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (the one this script is attached to)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Validate required fields
    if (!data.email || !data.timestamp || !data.userAgent) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'Missing required fields: email, timestamp, userAgent'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Append row with: [email, timestamp, userAgent]
    sheet.appendRow([
      data.email,
      data.timestamp,
      data.userAgent
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: Add headers to the sheet (run this once manually)
 * Click: Run → addHeaders
 */
function addHeaders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = ['Email', 'Timestamp', 'User Agent'];
  
  // Check if first row is empty
  const firstRow = sheet.getRange(1, 1, 1, 3).getValues()[0];
  if (firstRow.every(cell => !cell)) {
    sheet.getRange(1, 1, 1, 3).setValues([headers]);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
}
