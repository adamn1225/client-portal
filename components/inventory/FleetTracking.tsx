 {/* Maps displaying live location of fleet */}
import React, {useState, useEffect} from 'react'
import { createClient } from '@supabase/supabase-js'

const FleetTracking = () => {
  return (
    <div className="grid grid-cols-2 gap-6">

      {/* Fleet Selection from freight table */}
      <div className="col-span-1">
        <div className="w-full h-96 bg-gray-200">
          <h2>Fleet Selection</h2>
          <form>
            <select name="fleet" id="fleet">
              <option value="fleet1">Fleet 1</option>
              <option value="fleet2">Fleet 2</option>
              <option value="fleet3">Fleet 3</option>
              <option value="fleet4">Fleet 4</option>
            </select>
          </form>
        </div>
      </div>

      <div className="col-span-1">
        <div className="w-full h-96 bg-gray-200">
          <h2>Map</h2>
        </div>
      </div>

    </div>
  )
}

export default FleetTracking
