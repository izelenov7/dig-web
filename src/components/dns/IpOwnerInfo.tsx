import React from 'react';
import { Card } from '../ui';
import type { IpWhoisResult } from '../../lib/ipWhoisService';
import { formatOrganizationName } from '../../lib/ipWhoisService';

interface IpOwnerInfoProps {
  ipOwnerInfo: IpWhoisResult;
}

export const IpOwnerInfo: React.FC<IpOwnerInfoProps> = ({ ipOwnerInfo }) => {
  if (!ipOwnerInfo) {
    return null;
  }

  const { ip, organization, asn, country } = ipOwnerInfo;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="text-sm font-semibold text-slate-700">Владелец IP-адреса:</span>
      </div>
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="space-y-2">
          {/* Домен и IP */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-slate-500">IP-адрес:</span>
            <span className="font-mono text-sm text-slate-900 font-medium">{ip}</span>
          </div>

          {/* Организация */}
          <div className="flex items-start gap-3 flex-wrap">
            <span className="text-sm text-slate-500">Владелец:</span>
            <span className="text-sm text-slate-900 font-medium">{formatOrganizationName(organization)}</span>
          </div>

          {/* ASN */}
          {asn && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-500">ASN:</span>
              <span className="font-mono text-sm text-slate-900">{asn}</span>
            </div>
          )}

          {/* Страна */}
          {country && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-slate-500">Страна:</span>
              <span className="text-sm text-slate-900">{country}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
