import * as React from 'react';
import { useState, useEffect } from 'react';
import { PrimaryButton, DefaultButton, Dropdown, IDropdownOption, TextField, MessageBar, MessageBarType, Spinner, SpinnerSize } from '@fluentui/react';
import { spfi, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import { IRigProps, Customer } from './IRigProps';
import styles from './Rig.module.scss';

const Rig: React.FC<IRigProps> = (props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Customer>({
    CustomerName: '',
    Address: '',
    NumberofRigs: 0,
    NumberofJackUps: 0,
    NumberofMODU_x2019_s: 0,
    SiteURLs: { Url: '' }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: MessageBarType; text: string } | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState<IDropdownOption[]>([]);
  const [showAddForm, setShowAddForm] = useState(false); // Toggle Add form

  const sp = spfi(props.siteUrl).using(SPFx(props.context));

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const items: Customer[] = await sp.web.lists.getByTitle(props.listName).items();
      setCustomers(items);
      setDropdownOptions(items.map(item => ({ key: item.Id || 0, text: item.CustomerName })));
    } catch (error) {
      setMessage({ type: MessageBarType.error, text: `Error loading customers: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Customer, value: string | number | { Url: string }) => {
    setFormData(prev => {
      const newValue = typeof value === 'string' ? value : (typeof value === 'number' ? value : value.Url);
      return { ...prev, [field]: newValue };
    });
  };

  const handleCustomerSelect = (event?: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      let customer: Customer | undefined;
      for (const c of customers) {
        if (c.Id === option.key) {
          customer = c;
          break;
        }
      }
      if (customer) {
        setSelectedCustomer(customer);
        setFormData(customer); // Immediately reflect selected customer's data
        setShowAddForm(false); // Hide Add form when selecting an existing customer
      }
    }
  };

  const checkDuplicateCustomer = (name: string): boolean => {
    for (const customer of customers) {
      if (customer.CustomerName.toLowerCase() === name.toLowerCase()) {
        return true; // Duplicate found
      }
    }
    return false; // No duplicate
  };

  const handleSubmit = async () => {
    if (!formData.CustomerName || !formData.Address) {
      setMessage({ type: MessageBarType.warning, text: 'Customer Name and Address are required.' });
      return;
    }
    if (isNaN(formData.NumberofRigs) || isNaN(formData.NumberofJackUps) || isNaN(formData.NumberofMODU_x2019_s)) {
      setMessage({ type: MessageBarType.warning, text: 'Numeric fields must be valid numbers.' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      if (selectedCustomer?.Id) {
        // Update existing customer
        await sp.web.lists.getByTitle(props.listName).items.getById(selectedCustomer.Id).update({
          CustomerName: formData.CustomerName,
          Address: formData.Address,
          NumberofRigs: formData.NumberofRigs,
          NumberofJackUps: formData.NumberofJackUps,
          NumberofMODU_x2019_s: formData.NumberofMODU_x2019_s,
          SiteURLs: formData.SiteURLs.Url ? { Url: formData.SiteURLs.Url } : null
        });
        setMessage({ type: MessageBarType.success, text: 'Customer updated successfully!' });
      } else if (showAddForm) {
        // Add new customer with duplicate check
        if (checkDuplicateCustomer(formData.CustomerName)) {
          setMessage({ type: MessageBarType.warning, text: 'A customer with this name already exists.' });
          return;
        }
        await sp.web.lists.getByTitle(props.listName).items.add({
          CustomerName: formData.CustomerName,
          Address: formData.Address,
          NumberofRigs: formData.NumberofRigs,
          NumberofJackUps: formData.NumberofJackUps,
          NumberofMODU_x2019_s: formData.NumberofMODU_x2019_s,
          SiteURLs: formData.SiteURLs.Url ? { Url: formData.SiteURLs.Url } : null
        });
        setMessage({ type: MessageBarType.success, text: 'Customer added successfully!' });
      }
      loadCustomers(); // Refresh the customer list
      resetForm();
      setShowAddForm(false); // Hide Add form after submission
    } catch (error) {
      setMessage({ type: MessageBarType.error, text: `Error: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      CustomerName: '',
      Address: '',
      NumberofRigs: 0,
      NumberofJackUps: 0,
      NumberofMODU_x2019_s: 0,
      SiteURLs: { Url: '' }
    });
    setSelectedCustomer(null); // Clear selected customer on reset
  };

  return (
    <div className={styles.rig}>
      <h2>{props.description}</h2>

      {loading && <Spinner size={SpinnerSize.medium} label="Loading..." />}

      {message && (
        <MessageBar messageBarType={message.type} onDismiss={() => setMessage(null)}>
          {message.text}
        </MessageBar>
      )}

      <div className={styles.buttonGroup}>
        {showAddForm ? (
          <DefaultButton text="Edit Existing Customers" onClick={() => { setShowAddForm(false); resetForm(); }} />
        ) : (
          <DefaultButton text="Add New Customer" onClick={() => { setShowAddForm(true); resetForm(); }} />
        )}
      </div>

      <div className={styles.formSection}>
        <h3>{showAddForm ? 'Add New Customer' : 'Edit Customer'}</h3>

        {showAddForm ? (
          // Add New Customer Form
          <>
            <TextField
              label="Customer Name *"
              value={formData.CustomerName}
              onChange={(_, newValue) => handleInputChange('CustomerName', newValue || '')}
              required
            />

            <TextField
              label="Address *"
              value={formData.Address}
              onChange={(_, newValue) => handleInputChange('Address', newValue || '')}
              multiline rows={3}
              required
            />

            <TextField
              label="Number of Rigs"
              type="number"
              value={formData.NumberofRigs.toString()}
              onChange={(_, newValue) => handleInputChange('NumberofRigs', parseInt(newValue || '0') || 0)}
            />

            <TextField
              label="Number of Jack Ups"
              type="number"
              value={formData.NumberofJackUps.toString()}
              onChange={(_, newValue) => handleInputChange('NumberofJackUps', parseInt(newValue || '0') || 0)}
            />

            <TextField
              label="Number of MODU's"
              type="number"
              value={formData.NumberofMODU_x2019_s.toString()}
              onChange={(_, newValue) => handleInputChange('NumberofMODU_x2019_s', parseInt(newValue || '0') || 0)}
            />

            <TextField
              label="Site URLs"
              value={formData.SiteURLs.Url}
              onChange={(_, newValue) => handleInputChange('SiteURLs', { Url: newValue || '' })}
            />
          </>
        ) : (
          // Edit Existing Customer Form
          <>
            <Dropdown
              label="Select Customer to Edit"
              options={dropdownOptions}
              onChange={handleCustomerSelect}
              placeholder="Choose a customer..."
              required
              disabled={loading}
            />

            <TextField
              label="Customer Name *"
              value={formData.CustomerName}
              onChange={(_, newValue) => handleInputChange('CustomerName', newValue || '')}
              required
              disabled // Disable to prevent key mismatches
            />

            <TextField
              label="Address *"
              value={formData.Address}
              onChange={(_, newValue) => handleInputChange('Address', newValue || '')}
              multiline rows={3}
              required
            />

            <TextField
              label="Number of Rigs"
              type="number"
              value={formData.NumberofRigs.toString()}
              onChange={(_, newValue) => handleInputChange('NumberofRigs', parseInt(newValue || '0') || 0)}
            />

            <TextField
              label="Number of Jack Ups"
              type="number"
              value={formData.NumberofJackUps.toString()}
              onChange={(_, newValue) => handleInputChange('NumberofJackUps', parseInt(newValue || '0') || 0)}
            />

            <TextField
              label="Number of MODU's"
              type="number"
              value={formData.NumberofMODU_x2019_s.toString()}
              onChange={(_, newValue) => handleInputChange('NumberofMODU_x2019_s', parseInt(newValue || '0') || 0)}
            />

            <TextField
              label="Site URLs"
              value={formData.SiteURLs.Url}
              onChange={(_, newValue) => handleInputChange('SiteURLs', { Url: newValue || '' })}
            />
          </>
        )}

        <div className={styles.buttonGroup}>
          <PrimaryButton
            text={showAddForm ? 'Add Customer' : 'Update Customer'}
            onClick={handleSubmit}
            disabled={loading || (showAddForm && (!formData.CustomerName || checkDuplicateCustomer(formData.CustomerName))) || (!showAddForm && !selectedCustomer)}
          />
          <DefaultButton text="Reset" onClick={resetForm} disabled={loading} />
          {!showAddForm && (
            <DefaultButton text="Cancel Edit" onClick={() => { setSelectedCustomer(null); resetForm(); }} disabled={loading} />
          )}
          {showAddForm && (
            <DefaultButton text="Cancel Add" onClick={() => { setShowAddForm(false); resetForm(); }} disabled={loading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Rig;