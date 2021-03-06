Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    

	launch: function() {
		console.log('Our second app');


		this.pulldownContainer = Ext.create('Ext.container.Container', {
			layout: {
				type: 'hbox',
				align: 'stretch'
			}
		}
		);

		this.add(this.pulldownContainer);

		this._loadIterations();
	},


	_loadIterations: function() {
		this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
			fieldLabel : 'Iteration',
			listeners : {
				ready : function(thisCombo) {
					this._loadSeverity();
				},
				select : function() {
					this._loadData();
				},
				scope : this
			}
		});
		this.pulldownContainer.add(this.iterComboBox);
	},


	_loadSeverity: function() {
		this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
			model : 'Defect',
			field : 'Severity',
			fieldLabel : 'Iteration',
			listeners : {
				ready : function(thisCombo) {
					this._loadData();
				},
				select : function() {
					this._loadData();
				},
				scope : this
			}
		});
		this.pulldownContainer.add(this.severityComboBox);
	},



	_loadData: function() {
		var selectedIterationRef = this.iterComboBox.getRecord().get('_ref');
		var selectedSeverityRef = this.severityComboBox.getRecord().get('value');
		console.log('selectedIterationRef', selectedIterationRef);
		console.log('selectedSeverityRef', selectedSeverityRef);

		var defectFilters = [{
			property : 'Iteration',
			operation : '=',
			value : selectedIterationRef
		}, {
			property : 'Severity',
			operation : '=',
			value : selectedSeverityRef
		}];

		if (this.defectStore) {
			this.defectStore.setFilter(defectFilters);
			this.defectStore.load();
		} else {
			this.defectStore = Ext.create('Rally.data.wsapi.Store', {
				model : 'Defect',
				autoLoad : true,
				filters : defectFilters,
				listeners : {
					load : function(store, data, success) {
						console.log('Got the data! I did I did!', store, data, success);
						
						if (!this.myGrid) 
							this._createGrid(store);
					},
					scope : this
				},
				fetch : ['Name', 'ScheduleState', 'Severity', 'Iteration']
			});
		}
	},




	_createGrid: function(myStore) {
		this.myGrid = Ext.create('Rally.ui.grid.Grid', {
			store : myStore,
			columnCfgs : ['Name', 'ScheduleState', 'Severity']
		});
		this.add(this.myGrid);
	}
});
