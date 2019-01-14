/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import Metric, { AdhocMetric, MetricKey } from './Metric';

// Type signature and utility functions for formData shared by all viz types
// It will be gradually filled out as we build out the query object

// Define mapped type separately to work around a limitation of TypeScript
// https://github.com/Microsoft/TypeScript/issues/13573
// The Metrics in formData is either a string or a proper metric. It will be
// unified into a proper Metric type during buildQuery (see `/query/Metrics.ts`).

type RawMetric = AdhocMetric | string;
type Metrics = Partial<Record<MetricKey, RawMetric | RawMetric[] >>;

type BaseFormData = {
  datasource: string;
  where?: string;
  groupby?: string[];
  columns?: string[];
  allColumns?: string[];
  limit?: string;
  rowLimit: string;
  orderDesc: boolean;
  timeseriesLimitMetric: Metric;
  timeRange: string;
  since: string;
  until: string;

} & Metrics;

// FormData is either sqla-based or druid-based
type SqlaFormData = {
  granularity_sqla: string;
  timeGrainSqla?: string;
  having?: string;
} & BaseFormData;

type DruidFormData = {
  granularity: string;
  havingDruid?: string;
  druidTimeOrigin?: string;
} & BaseFormData;

type FormData =  BaseFormData & SqlaFormData & DruidFormData;
export default FormData;

export function getGranularity(formData: FormData): string {
  return 'granularity_sqla' in formData ? formData.granularity_sqla : formData.granularity;
}
