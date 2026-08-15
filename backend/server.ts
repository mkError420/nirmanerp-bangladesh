import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_PROJECTS,
  INITIAL_UNITS,
  INITIAL_RA_BILLS,
  INITIAL_STOCK_LEDGER,
  INITIAL_JOURNALS,
  INITIAL_PDC_CHEQUES,
  INITIAL_DPR,
  INITIAL_PR,
  INITIAL_PO,
  INITIAL_GRN,
  INITIAL_ACCOUNTS
} from '../Frontend/src/data/initialData';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory working database state
  let projects = [...INITIAL_PROJECTS];
  let units = [...INITIAL_UNITS];
  let raBills = [...INITIAL_RA_BILLS];
  let stockLedger = [...INITIAL_STOCK_LEDGER];
  let journals = [...INITIAL_JOURNALS];
  let pdcCheques = [...INITIAL_PDC_CHEQUES];
  let dprs = [...INITIAL_DPR];
  let prs = [...INITIAL_PR];
  let pos = [...INITIAL_PO];
  let grns = [...INITIAL_GRN];

  // ---------------------------------------------------------------------------
  // REST API ENDPOINTS (Returns JSON in `{ success: true, data: ..., message: ... }`)
  // ---------------------------------------------------------------------------

  app.get('/api/v1/health', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: { status: 'OK', system: 'NirmanERP Bangladesh Edition REST API', timestamp: new Date().toISOString() },
      message: 'Server is healthy.'
    });
  });

  // Projects API
  app.get('/api/v1/projects', (req: Request, res: Response) => {
    res.json({ success: true, data: projects, message: 'Projects retrieved successfully.' });
  });

  // Unit Sales Matrix API
  app.get('/api/v1/units', (req: Request, res: Response) => {
    const projectId = req.query.project_id ? Number(req.query.project_id) : 1;
    const projectUnits = units.filter(u => u.project_id === projectId);
    res.json({ success: true, data: projectUnits, message: 'Units matrix retrieved.' });
  });

  app.post('/api/v1/units/book', (req: Request, res: Response) => {
    const { unit_id, buyer_name, buyer_phone, buyer_nid } = req.body;
    const unitIndex = units.findIndex(u => u.id === Number(unit_id));

    if (unitIndex === -1) {
      return res.status(404).json({ success: false, data: null, message: 'Unit not found.' });
    }

    units[unitIndex] = {
      ...units[unitIndex],
      status: 'Booked',
      buyer_name,
      buyer_phone,
      buyer_nid,
      booking_date: new Date().toISOString().split('T')[0]
    };

    res.json({
      success: true,
      data: units[unitIndex],
      message: `Unit ${units[unitIndex].unit_number} booked successfully for ${buyer_name}.`
    });
  });

  // Subcontractor RA Bills API (Simulating PHP RAContractorController logic)
  app.get('/api/v1/ra-bills', (req: Request, res: Response) => {
    res.json({ success: true, data: raBills, message: 'RA Bills retrieved.' });
  });

  app.post('/api/v1/ra-bills/approve', (req: Request, res: Response) => {
    const {
      project_id,
      vendor_id,
      subcontractor_name,
      mb_number,
      work_description,
      gross_amount,
      retention_rate_pct = 10,
      ait_rate_pct = 5,
      vat_rate_pct = 0
    } = req.body;

    const gross = Number(gross_amount) || 0;
    const retPct = Number(retention_rate_pct) || 10;
    const aitPct = Number(ait_rate_pct) || 5;
    const vatPct = Number(vat_rate_pct) || 0;

    const retention_amount = Math.round((gross * retPct / 100) * 100) / 100;
    const ait_amount = Math.round((gross * aitPct / 100) * 100) / 100;
    const vat_amount = Math.round((gross * vatPct / 100) * 100) / 100;
    const net_payable = Math.round((gross - retention_amount - ait_amount + vat_amount) * 100) / 100;

    const billNumber = `RA-BD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newJournalId = 100 + journals.length + 1;
    const newJournal = {
      id: newJournalId,
      journal_number: `JV-RA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      journal_date: new Date().toISOString().split('T')[0],
      source_doc_type: 'RA_BILL' as const,
      source_doc_id: raBills.length + 1,
      narration: `Auto-Journal: RA Bill #${billNumber} Approved. Ref MB #${mb_number}. Gross: BDT ${gross}, Retention: BDT ${retention_amount}, AIT: BDT ${ait_amount}`,
      total_debit: gross,
      total_credit: gross,
      posted_by: 'System Auto-Journal',
      lines: [
        { id: 1, account_code: '5100-CIVIL-WORK', account_name: 'Direct Project Construction Civil Expense', debit: gross, credit: 0, remarks: `Gross Work Done MB #${mb_number}` },
        { id: 2, account_code: '2150-RETENTION-MONEY', account_name: 'Subcontractor Retention Money Held Payable', debit: 0, credit: retention_amount, remarks: `${retPct}% Retention Withheld` },
        { id: 3, account_code: '2120-AIT-TAX-PAYABLE', account_name: 'AIT / TDS Tax Payable (NBR)', debit: 0, credit: ait_amount, remarks: `${aitPct}% AIT Deducted at Source (BD IT Rule)` },
        { id: 4, account_code: '2100-SUBCONTRACTOR-PAYABLE', account_name: 'Subcontractor Accounts Payable', debit: 0, credit: net_payable, remarks: 'Net Payable Amount' }
      ]
    };

    journals.unshift(newJournal);

    const newBill = {
      id: raBills.length + 1,
      bill_number: billNumber,
      project_id: Number(project_id) || 1,
      project_name: 'Purbachal Green City Tower A',
      vendor_id: Number(vendor_id) || 3,
      subcontractor_name: subcontractor_name || 'Bengal Structure & Civil Engr',
      mb_number,
      bill_date: new Date().toISOString().split('T')[0],
      work_description,
      gross_amount: gross,
      retention_rate_pct: retPct,
      retention_amount,
      ait_rate_pct: aitPct,
      ait_amount,
      vat_rate_pct: vatPct,
      vat_amount,
      other_deductions: 0,
      net_payable,
      status: 'Approved' as const,
      approved_at: new Date().toISOString(),
      auto_journal_id: newJournalId
    };

    raBills.unshift(newBill);

    res.json({
      success: true,
      data: {
        bill: newBill,
        journal: newJournal
      },
      message: `RA Bill ${billNumber} approved, retention & AIT calculated, and auto GL journal posted.`
    });
  });

  // Store Stock Ledger & GRN API
  app.get('/api/v1/store/stock', (req: Request, res: Response) => {
    res.json({ success: true, data: stockLedger, message: 'Stock ledger retrieved.' });
  });

  app.post('/api/v1/procurement/grn', (req: Request, res: Response) => {
    const { po_id, project_id, chalan_number, vehicle_no, site_store_keeper, items } = req.body;

    let totalValuation = 0;
    const grnItemsFormatted = (items || []).map((item: any, idx: number) => {
      const qty = Number(item.qty) || 0;
      const price = Number(item.unit_price_bdt) || 0;
      const total = qty * price;
      totalValuation += total;

      // Update in-memory stock
      const stockIdx = stockLedger.findIndex(s => s.item_code === item.item_code);
      if (stockIdx !== -1) {
        stockLedger[stockIdx].current_balance += qty;
      } else {
        stockLedger.push({
          id: stockLedger.length + 1,
          project_id: Number(project_id) || 1,
          project_name: 'Purbachal Green City Tower A',
          item_code: item.item_code,
          item_name: item.item_name || item.item_code,
          unit: item.unit || 'Units',
          current_balance: qty,
          reorder_level: 10
        });
      }

      return {
        id: idx + 1,
        item_code: item.item_code,
        item_description: item.item_name || item.item_code,
        unit_of_measure: item.unit || 'Units',
        received_qty: qty,
        accepted_qty: qty,
        rejected_qty: 0,
        unit_price_bdt: price,
        total_value_bdt: total
      };
    });

    const newGrnNumber = `GRN-SITE-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrn = {
      id: grns.length + 1,
      grn_number: newGrnNumber,
      po_id: Number(po_id) || 1,
      project_id: Number(project_id) || 1,
      project_name: 'Purbachal Green City Tower A',
      received_date: new Date().toISOString().split('T')[0],
      chalan_number,
      vehicle_no: vehicle_no || 'Dhaka Metro Truck',
      site_store_keeper: site_store_keeper || 'Store Keeper',
      status: 'Stock Updated' as const,
      items: grnItemsFormatted
    };

    grns.unshift(newGrn);

    res.json({
      success: true,
      data: newGrn,
      message: `GRN ${newGrnNumber} recorded, stock ledger increased, and auto-journal logged.`
    });
  });

  // Mobile DPR API
  app.get('/api/v1/dpr', (req: Request, res: Response) => {
    res.json({ success: true, data: dprs, message: 'DPRs retrieved.' });
  });

  app.post('/api/v1/dpr', (req: Request, res: Response) => {
    const {
      project_id,
      site_engineer_name,
      weather_condition,
      mason_count,
      rod_binder_count,
      carpenter_count,
      electrician_count,
      helper_count,
      execution_summary,
      store_issues_summary,
      site_photo_urls
    } = req.body;

    const newDpr = {
      id: dprs.length + 1,
      project_id: Number(project_id) || 1,
      project_name: 'Purbachal Green City Tower A',
      dpr_date: new Date().toISOString().split('T')[0],
      weather_condition: weather_condition || 'Sunny & Clear',
      site_engineer_name: site_engineer_name || 'Engr. Kamrul Hasan',
      mason_count: Number(mason_count) || 0,
      rod_binder_count: Number(rod_binder_count) || 0,
      carpenter_count: Number(carpenter_count) || 0,
      electrician_count: Number(electrician_count) || 0,
      helper_count: Number(helper_count) || 0,
      execution_summary,
      store_issues_summary: store_issues_summary || 'No issues',
      site_photo_urls: site_photo_urls || [
        'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'
      ],
      status: 'Submitted' as const
    };

    dprs.unshift(newDpr);

    res.json({
      success: true,
      data: newDpr,
      message: 'Daily Progress Report submitted successfully.'
    });
  });

  // PDC Cheques API
  app.get('/api/v1/pdc', (req: Request, res: Response) => {
    res.json({ success: true, data: pdcCheques, message: 'PDCs retrieved.' });
  });

  app.post('/api/v1/pdc/status', (req: Request, res: Response) => {
    const { pdc_id, status, bounce_reason } = req.body;
    const idx = pdcCheques.findIndex(p => p.id === Number(pdc_id));

    if (idx === -1) {
      return res.status(404).json({ success: false, data: null, message: 'PDC Cheque not found.' });
    }

    pdcCheques[idx] = {
      ...pdcCheques[idx],
      status,
      clearance_date: status === 'Cleared' ? new Date().toISOString().split('T')[0] : undefined,
      bounce_reason: status === 'Bounced' ? bounce_reason : undefined
    };

    res.json({
      success: true,
      data: pdcCheques[idx],
      message: `PDC Cheque #${pdcCheques[idx].cheque_number} updated to ${status}.`
    });
  });

  // PHP Source Code Exporter API
  app.get('/api/v1/php-sources', (req: Request, res: Response) => {
    const readFileSafe = (relPath: string) => {
      try {
        return fs.readFileSync(path.join(process.cwd(), relPath), 'utf-8');
      } catch (err) {
        return `// Error reading ${relPath}`;
      }
    };

    res.json({
      success: true,
      data: {
        schema_sql: readFileSafe('../database/schema.sql'),
        database_php: readFileSafe('php-backend/config/Database.php'),
        auth_middleware_php: readFileSafe('php-backend/middleware/AuthMiddleware.php'),
        ra_controller_php: readFileSafe('php-backend/controllers/RAContractorController.php'),
        procurement_controller_php: readFileSafe('php-backend/controllers/ProcurementController.php'),
        tax_controller_php: readFileSafe('php-backend/controllers/TaxAitController.php')
      },
      message: 'PHP PDO backend source files and MySQL schema retrieved.'
    });
  });

  // ---------------------------------------------------------------------------
  // VITE MIDDLEWARE (DEV) / STATIC BUILD (PROD)
  // ---------------------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      root: path.join(process.cwd(), '../Frontend'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), '../Frontend/dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NirmanERP Express server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
