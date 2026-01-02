import fs from 'fs';
import csv from 'csv-parser';
import { CSVRow } from '../types';

export class CSVParser {
  static async parseCSV(filePath: string): Promise<CSVRow[]> {
    return new Promise((resolve, reject) => {
      const results: CSVRow[] = [];
      
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          // Normalize column names (case insensitive)
          const normalizedData: CSVRow = {
            category: data.category || data.Category || data.CATEGORY || '',
            amount: parseFloat(data.amount || data.Amount || data.AMOUNT || '0'),
            unit: data.unit || data.Unit || data.UNIT || '',
            date: data.date || data.Date || data.DATE || '',
            description: data.description || data.Description || data.DESCRIPTION || '',
            // Include any additional fields
            ...Object.keys(data).reduce((acc, key) => {
              const lowerKey = key.toLowerCase();
              if (!['category', 'amount', 'unit', 'date', 'description'].includes(lowerKey)) {
                acc[key] = data[key];
              }
              return acc;
            }, {} as Record<string, any>)
          };
          
          results.push(normalizedData);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  static validateCSVData(data: CSVRow[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('CSV file is empty');
      return { isValid: false, errors };
    }

    data.forEach((row, index) => {
      if (!row.category || row.category.trim() === '') {
        errors.push(`Row ${index + 1}: Category is required`);
      }
      
      if (!row.amount || isNaN(row.amount) || row.amount <= 0) {
        errors.push(`Row ${index + 1}: Valid amount is required`);
      }
      
      if (!row.unit || row.unit.trim() === '') {
        errors.push(`Row ${index + 1}: Unit is required`);
      }
      
      if (!row.date || row.date.trim() === '') {
        errors.push(`Row ${index + 1}: Date is required`);
      } else {
        // Validate date format
        const date = new Date(row.date);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${index + 1}: Invalid date format`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getExpectedCSVFormat(): string {
    return `Expected CSV format:
category,amount,unit,date,description
transport,100,km,2024-01-15,Commute to work
energy,50,kWh,2024-01-15,Electricity usage
food,2,kg,2024-01-15,Beef consumption
purchase,100,USD,2024-01-15,Online shopping

Categories: transport, energy, food, purchase, other
Units: km, miles, kWh, kg, lb, USD, EUR, etc.`;
  }
}
